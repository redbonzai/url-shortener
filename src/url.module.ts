import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities';
import { UrlController } from './controllers/url.controller';
import { UrlService } from './services/url.service';
import { UrlRepository } from './repositories/url.repository';
import { AppDataSource } from './data-source/data-source';
import { TypeOrmExModule } from './typeorm-ex-module/typeorm-ex.module';

@Module({
  // Add the TypeORM root configuration to initialize the database connection
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmExModule.forCustomRepository([UrlRepository]),
    TypeOrmModule.forFeature([Url]), // This registers the Url repository and entity
  ],
  providers: [UrlService, UrlRepository],
  controllers: [UrlController],
})
export class UrlModule {}
