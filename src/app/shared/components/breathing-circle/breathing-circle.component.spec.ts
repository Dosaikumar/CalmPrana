import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BreathingCircleComponent } from './breathing-circle.component';

describe('BreathingCircleComponent', () => {
  let component: BreathingCircleComponent;
  let fixture: ComponentFixture<BreathingCircleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BreathingCircleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BreathingCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
