import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendLoanDialogComponent } from './extend-loan-dialog.component';

describe('ExtendLoanDialogComponent', () => {
  let component: ExtendLoanDialogComponent;
  let fixture: ComponentFixture<ExtendLoanDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtendLoanDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExtendLoanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
