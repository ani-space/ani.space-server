import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base-models';

@Entity({ name: 'aniSpaceLogs' })
export class AniSpaceLog extends BaseEntity {
  @Column({ nullable: true })
  executeTime?: string;

  @Column({ type: 'text', nullable: true })
  requestObject?: string;

  @Column({ type: 'text', nullable: true })
  tracePath?: string;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
