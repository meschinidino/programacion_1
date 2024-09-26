import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoansComponent } from './user-loans.component';

describe('UserLoansComponent', () => {
  let component: UserLoansComponent;
  let fixture: ComponentFixture<UserLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserLoansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
