import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Product } from '../api/product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private basePath = "products"

    constructor(private http: HttpClient,
        private db: AngularFireDatabase) { }

    // Implementado
    createProduct(product: Product): any {
        return this.db.list<Product>(this.basePath).push(product);
    }

    updateProduct(key: string, value: any): Promise<void> {
        return this.db.object<Product>(`${this.basePath}/${key}`).update(value);
    }

    deleteProduct(key: string): Promise<void> {
        return this.db.object<Product>(`${this.basePath}/${key}`).remove();
    }
    // Fim Implementado

    getProductsSmall() {
        return this.http.get<any>('assets/demo/data/products-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProducts() {
        return this.http.get<any>('assets/demo/data/products.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsMixed() {
        return this.http.get<any>('assets/demo/data/products-mixed.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsWithOrdersSmall() {
        return this.http.get<any>('assets/demo/data/products-orders-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }
}
