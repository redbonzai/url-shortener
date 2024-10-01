import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Url } from '../entities';
import { Stats } from '../interfaces/stats.interface';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  async createShortUrl(originalUrl: string): Promise<Url> {
    if (!originalUrl.match(/^https?:\/\/[^\s$.?#].\S*$/)) {
      throw new BadRequestException('Invalid URL format');
    }

    const existingUrl = await this.urlRepository.findOne({
      where: { originalUrl },
    });

    if (existingUrl) {
      return existingUrl;
    }

    const slug = uuidv4().slice(0, 10);
    const newUrl = this.urlRepository.create({ originalUrl, slug });

    return await this.urlRepository.save(newUrl);
  }

  async findBySlug(slug: string): Promise<Url> {
    const url = await this.urlRepository.findOne({ where: { slug } });
    if (!url) {
      throw new NotFoundException('URL not found');
    }

    // Increment visit count
    url.visitCount += 1;
    await this.urlRepository.update(url.id, {
      visitCount: url.visitCount,
    });

    return url;
  }

  async getAllStats(): Promise<Stats[]> {
    const urls = await this.urlRepository.find();
    return urls.map((url: Url) => {
      const { originalUrl, slug, visitCount } = url;
      return {
        originalUrl,
        slug,
        visitCount,
      };
    });
  }
}
