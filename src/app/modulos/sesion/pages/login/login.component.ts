import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { SesionService } from '../../../shared/auth/sesion.service';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { SesionEndpointService } from '../../sesion-endpoint.service';
import { Messages } from 'src/app/modulos/shared/Messages';

@Component({
    standalone: true,
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',

    imports: [
        PasswordModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        ButtonModule,
        ReactiveFormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
    private auth: SesionService = inject(SesionService);
    public rest: SesionEndpointService = inject(SesionEndpointService);
    public msgs: Messages = inject(Messages);

    private loginSubscription: Subscription;

    public fb: FormBuilder = inject(FormBuilder);
    public formLogin: FormGroup;

    constructor() {}

    ngOnInit(): void {
        this.formLogin = this.fb.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]],
        });
    }

    onSubmit(): void {
        this.msgs.iniciarCarga();
        const email = this.formLogin.value.email;
        const password = this.formLogin.value.password;

        this.loginSubscription = this.rest.login(email, password).subscribe({
            next: (data: {
                token: string;
                tipo_usuario: string;
                expiry: string;
            }) => {
                this.msgs.detenerCarga();
                this.auth.saveDataLogin(
                    data.token,
                    data.tipo_usuario,
                    data.expiry
                );
                window.location.href = '/';
            },
            error: (error) => {
                if (error.error.message === 'EMAIL_NO_REGISTRADO') {
                    this.msgs.detenerCargaConErrorTexto(
                        'Error',
                        'El email ingresado no está registrado'
                    );
                } else {
                    this.msgs.detenerCargaConErrorGenerico();
                }
            },
        });
    }

    ngOnDestroy(): void {
        if (this.loginSubscription) {
            this.loginSubscription.unsubscribe();
        }
    }
}
