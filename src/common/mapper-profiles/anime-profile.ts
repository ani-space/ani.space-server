import { createMap, type Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Anime } from '~/models';
import { AnimeDto } from '../dtos/anime-dtos/anime.dto';
import { AnimeTitle } from '~/models/sub-models/anime-sub-models';
import { AnimeTitleDto } from '../dtos/anime-dtos/anime-title.dto';
import {
  AnimeDescription,
  AnimeTrailer,
  AnimeCoverImage,
  AnimeGenres,
  AnimeSynonyms,
  AnimeTag,
  AnimeConnection,
  AnimeTrendConnection,
  AnimeRank,
} from '../../models/sub-models/anime-sub-models';
import { AnimeDescriptionDto } from '../dtos/anime-dtos/anime-description.dto';
import { AnimeTrailerDto } from '../dtos/anime-dtos/anime-trailer.dto';
import { AnimeCoverImageDto } from '../dtos/anime-dtos/anime-cover-image.dto';
import { AnimeGenresDto } from '../dtos/anime-dtos/anime-genre.dto';
import { AnimeSynonymsDto } from '../dtos/anime-dtos/anime-synonyms.dto';
import { AnimeTagDto } from '../dtos/anime-dtos/anime-tag.dto';
import { AnimeConnectionDto } from '../dtos/anime-dtos/anime-connection.dto';
import { AiringSchedule } from '../../models/airing-schedule.model';
import { AiringScheduleDto } from '../dtos/airing-schedules-dtos/airing-schedule.dto';
import { AiringScheduleConnection } from '../../models/sub-models/airing-schedule-sub-models/airing-schedule-connection.model';
import { AiringScheduleConnectionDto } from '../dtos/airing-schedules-dtos/airing-schedule-connection.dto';
import { AnimeTrendConnectionDto } from '../dtos/anime-dtos/anime-trend-connection.dto';
import { MediaExternalLink } from '../../models/media-external-link.model';
import { MediaExternalLinkDto } from '../dtos/anime-dtos/media-external-link.dto';
import { AnimeRankDto } from '../dtos/anime-dtos/anime-rank.dto';
import { AnimeEdge } from '~/models/anime-edge.model';
import { AnimeEdgeDto } from '../dtos/anime-dtos/anime-edge.dto';
import { AnimeTrendEdge } from '../../models/sub-models/anime-sub-models/anime-trend-edge.model';
import { AnimeTrendEdgeDto } from '../dtos/anime-dtos/anime-trend-edge.dto';
import { AnimeTrend } from '../../models/sub-models/anime-sub-models/anime-trend.model';
import { AnimeTrendDto } from '../dtos/anime-dtos/anime-trend.dto';
import { AnimeStreamingEpisode } from '../../models/sub-models/anime-sub-models/anime-streaming-episode.model';
import { AnimeStreamingEpisodeDto } from '../dtos/anime-dtos/anime-streaming-episode.dto';
import { AnimeStreamingEpisodeSource } from '../../models/sub-models/anime-sub-models/anime-streaming-episode-sources.model';
import { AnimeStreamingEpisodeSourceDto } from '../dtos/anime-dtos/anime-streaming-episode-sources.dto';

@Injectable()
export class AnimeProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, Anime, AnimeDto);
      createMap(mapper, AnimeTitle, AnimeTitleDto);
      createMap(mapper, AnimeDescription, AnimeDescriptionDto);
      createMap(mapper, AnimeTrailer, AnimeTrailerDto);
      createMap(mapper, AnimeCoverImage, AnimeCoverImageDto);
      createMap(mapper, AnimeGenres, AnimeGenresDto);
      createMap(mapper, AnimeSynonyms, AnimeSynonymsDto);
      createMap(mapper, AnimeTag, AnimeTagDto);
      createMap(mapper, AnimeEdge, AnimeEdgeDto);
      createMap(mapper, AnimeConnection, AnimeConnectionDto);
      createMap(mapper, AiringSchedule, AiringScheduleDto);
      createMap(mapper, AiringScheduleConnection, AiringScheduleConnectionDto);
      createMap(mapper, AnimeTrendConnection, AnimeTrendConnectionDto);
      createMap(mapper, AnimeTrend, AnimeTrendDto);
      createMap(mapper, AnimeTrendEdge, AnimeTrendEdgeDto);
      createMap(mapper, MediaExternalLink, MediaExternalLinkDto);
      createMap(mapper, AnimeStreamingEpisode, AnimeStreamingEpisodeDto);
      createMap(
        mapper,
        AnimeStreamingEpisodeSource,
        AnimeStreamingEpisodeSourceDto,
      );
      createMap(mapper, AnimeRank, AnimeRankDto);
    };
  }
}
