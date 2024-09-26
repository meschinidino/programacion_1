import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanViewComponent } from './loan-view.component';

describe('LoanViewComponent', () => {
  let component: LoanViewComponent;
  let fixture: ComponentFixture<LoanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoanViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
