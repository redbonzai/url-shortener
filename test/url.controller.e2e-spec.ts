import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UrlModule } from '../src/url.module'; // Import your main app module

describe('UrlController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UrlModule], // Import your AppModule
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should shorten a URL', async () => {
    const response = await request(app.getHttpServer())
      .post('/shorten')
      .send({ url: 'http://example.com' })
      .expect(201);

    expect(response.body).toHaveProperty('shortUrl');
    expect(response.body.shortUrl).toContain('http://localhost:3250/');
  });

  it('should return stats', async () => {
    const response = await request(app.getHttpServer())
      .get('/stats')
      .expect(200);

    expect(response.body).toHaveProperty('stats');
    expect(Array.isArray(response.body.stats)).toBe(true);
  });

  it('should redirect to the original URL', async () => {
    // First, create a URL to test redirection
    const shortenResponse = await request(app.getHttpServer())
      .post('/shorten')
      .send({ url: 'http://example.com' })
      .expect(201);

    const slug = shortenResponse.body.shortUrl.split('/').pop(); // Extract slug from shortUrl

    const response = await request(app.getHttpServer())
      .get(`/${slug}`)
      .expect(302); // Expect a redirect response

    expect(response.headers.location).toBe('http://example.com');
  });
});
