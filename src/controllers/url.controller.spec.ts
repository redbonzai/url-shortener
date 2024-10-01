import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from '../services/url.service';
import { Url } from '../entities/url.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;

  const mockUrlService = {
    createShortUrl: jest.fn(),
    getAllStats: jest.fn(),
    findBySlug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('shortenUrl', () => {
    it('should return a short URL', async () => {
      const url = 'http://example.com';
      const shortUrlResponse = { slug: 'abc123' };
      mockUrlService.createShortUrl.mockResolvedValueOnce(shortUrlResponse);

      const result = await controller.shortenUrl(url);
      expect(result).toEqual({
        shortUrl: `http://localhost:3250/${shortUrlResponse.slug}`,
      });
    });

    it('should handle BadRequestException', async () => {
      const url = 'invalid-url';
      mockUrlService.createShortUrl.mockRejectedValueOnce(
        new BadRequestException('Invalid URL format'),
      );

      await expect(controller.shortenUrl(url)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getStats', () => {
    it('should return URL stats', async () => {
      const stats = [
        { originalUrl: 'http://example.com', slug: 'abc123', visitCount: 5 },
      ];
      mockUrlService.getAllStats.mockResolvedValueOnce(stats);

      const result = await controller.getStats();
      expect(result).toEqual({ stats });
    });
  });

  describe('redirectToOriginal', () => {
    it('should return the original URL for the given slug', async () => {
      const slug = 'abc123';
      const url = { originalUrl: 'http://example.com' };
      mockUrlService.findBySlug.mockResolvedValueOnce(url);

      const result = await controller.redirectToOriginal(slug);
      expect(result).toEqual({ url: url.originalUrl });
    });

    it('should handle NotFoundException', async () => {
      const slug = 'abc123';
      mockUrlService.findBySlug.mockRejectedValueOnce(
        new NotFoundException('URL not found'),
      );

      await expect(controller.redirectToOriginal(slug)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
