import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { Pet } from 'src/app/demo/api/pet.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { PetService } from 'src/app/demo/service/pet.service';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {

    petDialog: boolean = false;

    deletePetDialog: boolean = false;

    deletePetsDialog: boolean = false;

    pets: Pet[] = [];

    pet: Pet = {};

    selectedPets: Pet[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    sexoes: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private petService: PetService, private messageService: MessageService) { }

    ngOnInit() {
        this.petService.getPets().subscribe(data => this.pets = data);

        this.cols = [
            { field: 'product', header: 'Pet' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'sexo', header: 'Status' }
        ];

        this.sexoes = [
            { label: 'MASCULINO', value: 'masculino' },
            { label: 'FEMININO', value: 'feminino' },
            { label: 'OUTRO', value: 'outro' }
        ];

        setTimeout(() => {
            console.log(this.pets);
        }, 3000);
    }

    openNew() {
        this.pet = {};
        this.submitted = false;
        this.petDialog = true;
    }

    deleteSelectedPets() {
        this.deletePetsDialog = true;
    }

    editPet(pet: Pet) {
        this.pet = { ...pet };
        this.petDialog = true;
    }

    deletePet(pet: Pet) {
        this.deletePetDialog = true;
        this.pet = { ...pet };
    }

    confirmDeleteSelected() {
        this.deletePetsDialog = false;
        // this.pets = this.pets.filter(val => !this.selectedPets.includes(val));

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedPets = [];
    }

    confirmDelete() {
        this.deletePetDialog = false;
        // this.pets = this.pets.filter(val => val.id !== this.pet.id);
        this.petService.deletePet(this.pet.key);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pet Deleted', life: 3000 });
        this.pet = {};
    }

    hideDialog() {
        this.petDialog = false;
        this.submitted = false;
    }

    savePet() {
        this.submitted = true;

        if (this.pet.name?.trim()) {
            if (this.pet.id) {
                // @ts-ignore
                this.pet.sexo = this.pet.sexo.value ? this.pet.sexo.value : this.pet.sexo;
                // this.pets[this.findIndexById(this.pet.id)] = this.pet;
                this.petService.updatePet(this.pet.key, this.pet);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pet Updated', life: 3000 });
            } else {
                this.pet.id = this.createId();
                this.petService.createPet(this.pet);
                // @ts-ignore
                this.pet.sexo = this.pet.sexo ? this.pet.sexo.value : 'INSTOCK';
                // this.pets.push(this.pet);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pet Created', life: 3000 });
            }

            this.pets = [...this.pets];
            this.petDialog = false;
            this.pet = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.pets.length; i++) {
            if (this.pets[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
