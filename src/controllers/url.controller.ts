import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  BadRequestException,
} from '@nestjs/common';
import { UrlService } from '../services/url.service';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('/shorten')
  async shortenUrl(@Body('url') url: string) {
    try {
      const shortUrl = await this.urlService.createShortUrl(url);
      return {
        shortUrl: `http://localhost:3250/${shortUrl.slug}`,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create short URL');
    }
  }

  @Get('/stats')
  async getStats() {
    const stats = await this.urlService.getAllStats();
    return { stats };
  }

  @Get('/:slug')
  @Redirect()
  async redirectToOriginal(@Param('slug') slug: string) {
    const url = await this.urlService.findBySlug(slug);
    return { url: url.originalUrl };
  }
}
