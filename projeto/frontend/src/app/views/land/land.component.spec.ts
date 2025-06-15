import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandComponent } from './land.component';


describe('InitialComponent', () => {
  let component: LandComponent;
  let fixture: ComponentFixture<LandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
