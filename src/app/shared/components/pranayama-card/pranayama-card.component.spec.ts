import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PranayamaCardComponent } from './pranayama-card.component';

describe('PranayamaCardComponent', () => {
  let component: PranayamaCardComponent;
  let fixture: ComponentFixture<PranayamaCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PranayamaCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PranayamaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
