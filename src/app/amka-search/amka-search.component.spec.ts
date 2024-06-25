import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmkaSearchComponent } from './amka-search.component';

describe('AmkaSearchComponent', () => {
  let component: AmkaSearchComponent;
  let fixture: ComponentFixture<AmkaSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmkaSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmkaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
