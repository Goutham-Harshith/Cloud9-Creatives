import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JuteComponent } from './jute.component';

describe('JuteComponent', () => {
  let component: JuteComponent;
  let fixture: ComponentFixture<JuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JuteComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
