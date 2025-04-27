import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeeqComponent } from './typeeq.component';

describe('TypeeqComponent', () => {
  let component: TypeeqComponent;
  let fixture: ComponentFixture<TypeeqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeeqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeeqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
