import { Injectable } from '@nestjs/common';
import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class QueryBuilderChainer<Entity extends ObjectLiteral> {
  private queryBuilder: SelectQueryBuilder<Entity>;

  constructor(builder: SelectQueryBuilder<Entity>) {
    this.queryBuilder = builder;
  }

  public applyJoinConditionally(
    shouldJoin: boolean,
    alias: string,
    target: string,
    isFullSelect?: boolean,
  ) {
    if (!shouldJoin) return this;

    if (isFullSelect) {
      this.queryBuilder.leftJoinAndSelect(`${alias}.${target}`, target);
    } else {
      this.queryBuilder.leftJoin(`${alias}.${target}`, target);
    }
    return this;
  }

  public applyOrderByConditionally(
    shouldOrder: boolean,
    orderColumn: string,
    order: 'DESC' | 'ASC',
  ) {
    if (!shouldOrder) return this;

    this.queryBuilder.addOrderBy(orderColumn, order);

    return this;
  }

  public applyOrWhereConditionally(
    entityName: string,
    column: string,
    value?: string | number | boolean,
  ) {
    if (!value) return this;

    this.queryBuilder.orWhere(`${entityName}.${column} = :${column}`, {
      [column]: value,
    });

    return this;
  }

  /**
   * The method provides the 'Where' clause with operators that support comparison.
   *
   * @param {string} entityName - Table name or Alias.
   * @param {string} column - Column name.
   * @param {string | number | boolean | string[] | number[] | boolean[]} value - The value to be compared can be null or undefined
   * @param {string} operator - Operator used for comparison
   * @returns {this} this
   */
  public applyWhereConditionally(
    entityName: string,
    column: string,
    value?: string | number | boolean | string[] | number[] | boolean[] | null,
    operator: '<' | '<=' | '>' | '>=' | '=' | '!=' | 'IN' | 'NOT IN' = '=',
  ) {
    if (!value || (Array.isArray(value) && value.length === 0)) return this;

    switch (operator) {
      case 'IN':
      case 'NOT IN':
        this.queryBuilder.andWhere(
          `${entityName}.${column} ${operator} (:...${column}s)`,
          {
            [`${column}s`]: value,
          },
        );
        break;
      default:
        this.queryBuilder.andWhere(
          `${entityName}.${column} ${operator} :${column}`,
          {
            [column]: value,
          },
        );
    }

    return this;
  }

  /**
   * The method for performing fuzzy search queries is based on the pg_trgm utility of the Postgresql database (Note, the utility only supports Pg versions above 12)
   *
   * @param {string} entityName - Table name or Alias.
   * @param {string} column - Column name.
   * @param {string | number | boolean | string[] | number[] | boolean[]} searchTerm - The value to be compared can be null or undefined
   * @param {number} similarity - value from 0.1 to 1: Matching weight between the input value and the result (The higher the weight, the smaller but more accurate the returned result set)
   * @param {string} order - The order in which the result set will be returned (default will be DESC, record with highest match to lowest)
   * @returns {this} this
   */
  public applyFuzzySearch(
    entityName: string,
    column: string,
    similarity: number = 0.3,
    order: 'DESC' | 'ASC' = 'DESC',
    searchTerm?: string | number | boolean | null,
  ) {
    if (!searchTerm) return this;

    this.queryBuilder
      .andWhere(
        `word_similarity(${entityName}.${column}, :searchTerm) > ${similarity}`,
        { searchTerm },
      )
      .addOrderBy(
        `word_similarity(${entityName}.${column}, :searchTerm)`,
        order,
      )
      .setParameter('searchTerm', searchTerm);

    return this;
  }

  /**
   * This method can only be used within the project, with the anime.title table. Extended idea from applyFuzzySearch function
   */
  public applyFuzzySearchAnime(
    title?: string | number | null,
    similarityWeight: number = 0.3,
    order: 'DESC' | 'ASC' = 'DESC',
  ) {
    if (!title) return this;

    this.queryBuilder
      .addSelect(
        'GREATEST(word_similarity(title.english, :title), word_similarity(title.romaji, :title), word_similarity(title.native, :title), word_similarity(title.userPreferred, :title), word_similarity(title.vietnamese, :title))',
        'maxMatchingScore',
      )
      .andWhere(
        `word_similarity(title.english, :title) > :similarityWeight
        OR word_similarity(title.romaji, :title) > :similarityWeight
        OR word_similarity(title.native, :title) > :similarityWeight
        OR word_similarity(title.userPreferred, :title) > :similarityWeight
        OR word_similarity(title.vietnamese, :title) > :similarityWeight
        OR word_similarity(synonyms.synonym, :title) > :similarityWeight`,
        { title },
      )
      .setParameter('title', title)
      .setParameter('similarityWeight', similarityWeight)
      .orderBy('"maxMatchingScore"', order);

    return this;
  }

  public applyWhere(
    leftTable: string,
    leftTableColumn: string,
    rightTable: string,
    rightTableColumn: string,
  ) {
    this.queryBuilder.where(
      `${leftTable}.${leftTableColumn} = ${rightTable}.${rightTableColumn}`,
    );

    return this;
  }

  public applyLeftJoinAndMapMany(
    leftTable: string,
    rightTable: string,
    selectQueryBuilder: SelectQueryBuilder<Entity>,
  ) {
    this.queryBuilder.leftJoinAndMapMany(
      `${leftTable}.${rightTable}`,
      () => selectQueryBuilder,
      rightTable,
    );

    return this;
  }

  public applyTake(limit: number = 15) {
    this.queryBuilder.take(limit);

    return this;
  }

  public applySkip(skip: number) {
    this.queryBuilder.skip(skip);

    return this;
  }

  public addSelect(
    o: any,
    tableName: string,
    forceSelect?: boolean,
    ignoreColumns?: Array<string>,
  ) {
    if (!o || typeof o !== 'object') {
      return this;
    }

    let columns = Object.getOwnPropertyNames(o);

    // always get id to get sub fields
    if (!columns.some((col) => col === 'id')) {
      columns.push('id');
    }

    columns = columns
      .filter((e) => !ignoreColumns?.includes(e))
      .map((col) => `${tableName}.${col}`);

    if (forceSelect) {
      this.queryBuilder.select(columns);
    } else {
      this.queryBuilder.addSelect(columns);
    }

    return this;
  }

  public getQueryBuilder() {
    return this.queryBuilder;
  }
}
