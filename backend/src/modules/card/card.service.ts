import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Status } from '@prisma/client';
import { ObjectId } from 'mongodb';
// private readonly websocketGateway: WebsocketService,

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto) {
    try {
      const cardCreated = await this.prisma.card.create({
        data: {
          ...createCardDto,
          status: Status.PENDING,
        },
      });

      console.log(cardCreated);

      return cardCreated;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    const cards = await this.prisma.card.findMany({
      take: 50,
    });

    return cards;
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    this.isValidId(id);

    await this.existsCard(id);

    try {
      const updatedCard = await this.prisma.card.update({
        data: {
          status: updateCardDto.status,
        },
        where: {
          id,
        },
      });

      // this.websocketGateway.updateCard(updatedCard);

      return updatedCard;
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudo actualizar la tarjeta',
      );
    }
  }

  async remove(id: string) {
    this.isValidId(id);

    await this.existsCard(id);

    try {
      await this.prisma.card.delete({
        where: {
          id,
        },
      });

      return {
        success: true,
      };
    } catch (error) {
      throw new InternalServerErrorException('No se pudo eliminar la tarjeta');
    }
  }

  isValidId(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('No es un ObjectId valido');
    }
  }

  async existsCard(id: string) {
    const foundCard = await this.prisma.card.findUnique({
      where: {
        id,
      },
    });
    if (!foundCard) {
      throw new NotFoundException('No existe la tarjeta');
    }
  }
}
