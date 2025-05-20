//product/entities/product.entity.ts
import { ViewEntity, PrimaryColumn, Column } from 'typeorm';

@ViewEntity({ name: 'products' }) // 데이터베이스에 있는 'users' 뷰를 매핑
export class Product {
  @PrimaryColumn()
  id: number;

  @Column()
  barcode: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  location_x: number;

  @Column()
  location_y: number;

  @Column()
  img_url: string;
}
