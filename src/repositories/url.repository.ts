import { Repository } from 'typeorm';
import { Url } from '../entities';
import { CustomRepository } from '../decorators/custom-repository.decorator';

@CustomRepository(Url)
export class UrlRepository extends Repository<Url> {
  // Add any custom methods for GameCell entity if needed
}
