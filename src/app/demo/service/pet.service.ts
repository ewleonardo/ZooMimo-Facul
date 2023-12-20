import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Pet } from '../api/pet.model';

@Injectable({
    providedIn: 'root'
})
export class PetService {
    private basePath = "pets"

    constructor(private db: AngularFireDatabase) { }

    // Implementado
    createPet(pet: Pet): any {
        return this.db.list<Pet>(this.basePath).push(pet);
    }

    getPets() {
        return this.db.list<Pet>(this.basePath)
            .snapshotChanges().pipe(
                map(changes =>
                    changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
                )
            )
    }

    updatePet(key: string, value: any): Promise<void> {
        return this.db.object<Pet>(`${this.basePath}/${key}`).update(value);
    }

    deletePet(key: string): Promise<void> {
        return this.db.object<Pet>(`${this.basePath}/${key}`).remove();
    }
    // Fim Implementado

    // getProductsSmall() {
    //     return this.http.get<any>('assets/demo/data/products-small.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    // getProducts() {
    //     return this.http.get<any>('assets/demo/data/products.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    // getProductsMixed() {
    //     return this.http.get<any>('assets/demo/data/products-mixed.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    // getProductsWithOrdersSmall() {
    //     return this.http.get<any>('assets/demo/data/products-orders-small.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }
}
