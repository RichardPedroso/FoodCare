import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowActionsComponent } from './follow-actions.component';

describe('FollowActionsComponent', () => {
  let component: FollowActionsComponent;
  let fixture: ComponentFixture<FollowActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
