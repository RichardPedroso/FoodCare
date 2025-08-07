import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetUserPasswordComponent } from './reset-user-password.component';

describe('ResetUserPasswordComponent', () => {
  let component: ResetUserPasswordComponent;
  let fixture: ComponentFixture<ResetUserPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetUserPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetUserPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
