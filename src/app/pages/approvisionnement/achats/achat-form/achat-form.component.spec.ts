import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchatFormComponent } from './achat-form.component';

describe('AchatFormComponent', () => {
  let component: AchatFormComponent;
  let fixture: ComponentFixture<AchatFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchatFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
