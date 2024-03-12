import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppLayoutComponent } from './app.layout.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AppCarritoComponent } from './app.carrito.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppTopBarComponent,
        AppFooterComponent,
        AppLayoutComponent,
        AppCarritoComponent,
    ],
    imports: [
        ButtonModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RippleModule,
        RouterModule,
        ToastModule,
        OverlayPanelModule,
        InputTextModule,
        FormsModule,
    ],
    providers: [MessageService],
    exports: [AppLayoutComponent],
})
export class AppLayoutModule {}
