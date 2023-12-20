import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Tutor } from '../api/tutor.model';

@Injectable({
    providedIn: 'root'
})
export class TutorService {
    private basePath = "tutores"

    constructor(private db: AngularFireDatabase) { }

    // Implementado
    createTutor(tutor: Tutor): any {
        return this.db.list<Tutor>(this.basePath).push(tutor);
    }

    getTutors() {
        return this.db.list<Tutor>(this.basePath)
            .snapshotChanges().pipe(
                map(changes =>
                    changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
                )
            )
    }

    updateTutor(key: string, value: any): Promise<void> {
        return this.db.object<Tutor>(`${this.basePath}/${key}`).update(value);
    }

    deleteTutor(key: string): Promise<void> {
        return this.db.object<Tutor>(`${this.basePath}/${key}`).remove();
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
