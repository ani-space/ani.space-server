import { Injectable } from '@nestjs/common';
import { IAnimeHayService } from '~/contracts/services';
import { HttpService } from '@nestjs/axios';
import { OnEvent } from '@nestjs/event-emitter';
import { SynchronizedAnimeEnum } from '../graphql/types/enums/synchronization-type.enum';
import { parse } from 'node-html-parser';

@Injectable()
export class AnimeHayService implements IAnimeHayService {
  constructor(private readonly animeHayClient: HttpService) {}

  @OnEvent(SynchronizedAnimeEnum.SEARCH_ANIMEHAY)
  public async searchAnime() {
    const { data } = await this.animeHayClient.axiosRef.get(
      `/tim-kiem/${encodeURI('Cowboy Bebop')}.html`,
      {
        headers: {
          'Content-Type':
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        },
      },
    );

    const document = parse(data);
    const animeItems = document.querySelectorAll('.movie-item a');
    const animeResult = animeItems.map((e) => {
      return {
        title: e.textContent.trim(),
        animePath: e.getAttribute('href'),
      };
    });

    console.log('animeItem: ', animeResult);
  }
}
