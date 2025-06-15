import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeActionComponent } from './make-action.component';

describe('MakeActionComponent', () => {
  let component: MakeActionComponent;
  let fixture: ComponentFixture<MakeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
