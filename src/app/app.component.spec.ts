import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgIf } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { NpDataService } from './np-data/lib/np-data.service';

class TestNpService {
  npData$ = new BehaviorSubject([]);
}



describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        RouterOutlet,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        NgIf,
        AsyncPipe,
        UserMenuComponent,
        RouterLink,
        CdkScrollableModule,
      ],
      declarations: [AppComponent],
      providers: [
        {
          provide: NpDataService,
          useClass: TestNpService,
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;


    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });


});
