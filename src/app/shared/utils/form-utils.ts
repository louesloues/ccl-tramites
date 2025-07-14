import { FormGroup } from '@angular/forms';
export class FormUtils{

    static isValidField(form:FormGroup,fieldName:string):boolean | null{

        return (
           !!form.controls[fieldName].errors && form.controls[fieldName].touched
        );

    }

    static getFieldError(form:FormGroup,fieldName:string): string |  null {
        if ( !form.controls[fieldName]) return null;
        const errors = form.controls[fieldName].errors ?? [];

        for ( const key of Object.keys(errors)){
            switch(key){
                case 'required':
                    return 'Este campo es requerido.';
                case 'minlength':
                    return `Valor minimo de ${errors['min'].min}`;
                case 'pattern':
                    return `'${errors['pattern'].actualValue}' no es un valor válido para este campo.`;
            }
        }
    }

}
