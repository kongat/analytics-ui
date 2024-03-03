import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMyPassComponent } from './change-my-pass.component';

describe('ChangeMyPassComponent', () => {
  let component: ChangeMyPassComponent;
  let fixture: ComponentFixture<ChangeMyPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeMyPassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeMyPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
