import {
  Repository,
  FindOneOptions,
  FindManyOptions,
  DeepPartial,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class AbstractRepository<T> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findOne(options: FindOneOptions<T>): Promise<T | undefined> {
    return this.repository.findOne(options);
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async update(id: number, data: QueryDeepPartialEntity<T>): Promise<void> {
    await this.repository.update(id, data); // Use `_QueryDeepPartialEntity<T>` for updates
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
