import { Body, Controller, Get, Inject, Param, ParseIntPipe, Query, Post, Patch, Delete } from '@nestjs/common';
import { NATS_SERVICE } from '../config/service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from '../common/dto/pagination.dto';
import { catchError } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto){
    return this.client.send({cmd: 'find_all_products'}, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number){

    return this.client.send({ cmd: 'find_one_product' }, {id}).pipe(
      catchError(err =>{ throw new RpcException(err)} )
    );
    // try{
    //   const product = await firstValueFrom(
    //      this.productClient.send({ cmd: 'find_one_product' }, {id})
    //   );
    //   return product;
    // }catch(error){
    //   throw new RpcException(error);
    // }
    
  }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto){
    return this.client.send({cmd: 'create_product'}, createProductDto)
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ){
    return this.client.send({cmd: 'update_product'}, {
      id,
      ...updateProductDto
    }).pipe(
      catchError( err => { throw new RpcException(err)})
    );
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number){
    return this.client.send({cmd: 'delete_product'}, {id}).pipe(
      catchError( err => { throw new RpcException(err)})
    );;
  }
}
