import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPassDialogComponent } from './user-pass-dialog.component';

describe('UserPassDialogComponent', () => {
  let component: UserPassDialogComponent;
  let fixture: ComponentFixture<UserPassDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPassDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
