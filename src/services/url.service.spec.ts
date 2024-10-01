import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from '../entities/url.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UrlService', () => {
  let service: UrlService;
  let repository: Repository<Url>;

  const mockUrlRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(Url),
          useValue: mockUrlRepository,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    repository = module.get<Repository<Url>>(getRepositoryToken(Url));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createShortUrl', () => {
    it('should create a new short URL', async () => {
      const originalUrl = 'http://example.com';
      const url = { originalUrl, slug: 'abc123' };
      mockUrlRepository.findOne.mockResolvedValueOnce(null);
      mockUrlRepository.create.mockReturnValue(url);
      mockUrlRepository.save.mockResolvedValue(url);

      const result = await service.createShortUrl(originalUrl);
      expect(result).toEqual(url);
      expect(mockUrlRepository.findOne).toHaveBeenCalledWith({
        where: { originalUrl },
      });
      expect(mockUrlRepository.save).toHaveBeenCalledWith(url);
    });

    it('should throw BadRequestException for invalid URL', async () => {
      const originalUrl = 'invalid-url';
      await expect(service.createShortUrl(originalUrl)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return existing short URL if it exists', async () => {
      const originalUrl = 'http://example.com';
      const existingUrl = { originalUrl, slug: 'abc123' };
      mockUrlRepository.findOne.mockResolvedValueOnce(existingUrl);

      const result = await service.createShortUrl(originalUrl);
      expect(result).toEqual(existingUrl);
      expect(mockUrlRepository.findOne).toHaveBeenCalledWith({
        where: { originalUrl },
      });
      expect(mockUrlRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findBySlug', () => {
    it('should return the URL for the given slug', async () => {
      const slug = 'abc123';
      const url = {
        id: 1,
        slug,
        originalUrl: 'http://example.com',
        visitCount: 1,
      };
      mockUrlRepository.findOne.mockResolvedValueOnce(url);

      const result = await service.findBySlug(slug);
      expect(result).toEqual(url);
      expect(mockUrlRepository.findOne).toHaveBeenCalledWith({
        where: { slug },
      });
    });

    it('should throw NotFoundException if URL is not found', async () => {
      const slug = 'abc123';
      mockUrlRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findBySlug(slug)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllStats', () => {
    it('should return all URL stats', async () => {
      const urls = [
        { originalUrl: 'http://example.com', slug: 'abc123', visitCount: 5 },
      ];
      mockUrlRepository.find.mockResolvedValueOnce(urls);

      const result = await service.getAllStats();
      expect(result).toEqual(urls);
      expect(mockUrlRepository.find).toHaveBeenCalled();
    });
  });
});
