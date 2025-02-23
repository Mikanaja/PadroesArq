import { inject, Injectable } from "@angular/core";
import { setProvider } from "../providers/global.providers";
import { FormBuilder } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {

    constructor() {
        this.createGlobalProviders();
    }

    private createGlobalProviders(): void {
        setProvider(FormBuilder, inject(FormBuilder));
    }
}