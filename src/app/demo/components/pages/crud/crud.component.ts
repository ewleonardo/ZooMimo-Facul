import { Component, OnInit } from '@angular/core';
import { Tutor } from 'src/app/demo/api/tutor.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TutorService } from 'src/app/demo/service/tutor.service';
import { CEPError, Endereco, NgxViacepService } from "@brunoc/ngx-viacep"; // Importando o viacep
import { catchError, EMPTY } from 'rxjs';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})

export class CrudComponent implements OnInit {

    tutorDialog: boolean = false;

    deleteTutorDialog: boolean = false;

    deleteTutorsDialog: boolean = false;

    tutors: Tutor[] = [];

    tutor: Tutor = {};

    selectedTutors: Tutor[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    sexoes: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private viacep: NgxViacepService, private tutorService: TutorService, private messageService: MessageService) { }

    ngOnInit() {
        this.tutorService.getTutors().subscribe(data => this.tutors = data);

        this.cols = [
            { field: 'product', header: 'Tutor' },
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
            console.log(this.tutors);
        }, 3000);
    }

    openNew() {
        this.tutor = {};
        this.submitted = false;
        this.tutorDialog = true;
    }

    deleteSelectedTutors() {
        this.deleteTutorsDialog = true;
    }

    editTutor(tutor: Tutor) {
        this.tutor = { ...tutor };
        this.tutorDialog = true;
    }

    deleteTutor(tutor: Tutor) {
        this.deleteTutorDialog = true;
        this.tutor = { ...tutor };
    }

    confirmDeleteSelected() {
        this.deleteTutorsDialog = false;

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedTutors = [];
    }

    confirmDelete() {
        this.deleteTutorDialog = false;
        this.tutorService.deleteTutor(this.tutor.key);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tutor Deleted', life: 3000 });
        this.tutor = {};
    }

    hideDialog() {
        this.tutorDialog = false;
        this.submitted = false;
    }

    saveTutor() {
        this.submitted = true;

        if (this.tutor.name?.trim()) {
            if (this.tutor.id) {
                // @ts-ignore
                this.tutor.sexo = this.tutor.sexo.value ? this.tutor.sexo.value : this.tutor.sexo;
                // this.tutors[this.findIndexById(this.tutor.id)] = this.tutor;
                this.tutorService.updateTutor(this.tutor.key, this.tutor);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tutor Updated', life: 3000 });
            } else {
                this.tutor.id = this.createId();
                this.tutorService.createTutor(this.tutor);
                // @ts-ignore
                this.tutor.sexo = this.tutor.sexo ? this.tutor.sexo.value : 'INSTOCK';
                // this.tutors.push(this.tutor);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tutor Created', life: 3000 });
            }

            this.tutors = [...this.tutors];
            this.tutorDialog = false;
            this.tutor = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.tutors.length; i++) {
            if (this.tutors[i].id === id) {
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

    consultaCEP(cep, form) {
        cep = cep.replace(/\D/g, '');
        // var validacep = /^[0-9]{8}$/;
        this.viacep
            .buscarPorCep(cep)
            .pipe(
                catchError((error: CEPError) => {
                    // Ocorreu algum erro :/
                    console.log(error.message);
                    return EMPTY;
                })
            )
            .subscribe((endereco: Endereco) => {
                // Endereço retornado :)
                // console.log(endereco);
                this.popularForm(endereco, form);
            });

    }

    popularForm(endereco, form) {
        console.log(endereco, 'CHEGOU NO POPULAR!');
        form.setValue({
            // endereco: {
            estado: endereco.uf,
            cidade: endereco.localidade,
            bairro: endereco.bairro,
            rua: endereco.logradouro,
            numero: null,
            // }

        })

    }
}
