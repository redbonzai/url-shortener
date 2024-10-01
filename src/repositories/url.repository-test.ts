import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../entities';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class UrlRepository extends AbstractRepository<Url> {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepo: Repository<Url>,
  ) {
    super(urlRepo);
  }

  async findBySlug(slug: string): Promise<Url | undefined> {
    return this.repository.findOne({ where: { slug } });
  }
}
