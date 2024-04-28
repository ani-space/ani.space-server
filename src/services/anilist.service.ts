import { InjectGraphQLClient } from '@golevelup/nestjs-graphql-request';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { GraphQLClient, gql } from 'graphql-request';
import { IAnilistService } from '~/contracts/services';
import { GET_ANIME_SCALARS_TYPE } from '../common/constants/index';

@Injectable()
export class AnilistService implements IAnilistService {
  private readonly logger = new Logger(AnilistService.name);

  constructor(
    @InjectGraphQLClient() private client: GraphQLClient,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Although named Scalars Type, I've handled or synchronized fields with moderately complex structures. Fields with deeper complexity are synchronized through the Anime's idAnilist via handlers.
   */
  @OnEvent(GET_ANIME_SCALARS_TYPE)
  public async handleGetAnimeScalarsType() {
    // const document = gql`
    //   {
    //     Page(page: 1, perPage: 25) {
    //       media(type: ANIME) {
    //         id
    //         title {
    //           romaji
    //           english
    //           native
    //           userPreferred
    //         }
    //       }
    //     }
    //   }
    // `;

    // const res = await this.client.request(document);

    const i = setInterval(() => {
      this.logger.log('HIIIIII! ');
    }, 500);
  }
}
