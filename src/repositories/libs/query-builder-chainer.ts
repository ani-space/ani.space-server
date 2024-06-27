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

  public applyWhereConditionally(
    entityName: string,
    column: string,
    value?: string | number | boolean,
  ) {
    if (!value) return this;

    this.queryBuilder.andWhere(`${entityName}.${column} = :${column}`, {
      [column]: value,
    });

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
