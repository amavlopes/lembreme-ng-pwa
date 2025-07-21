import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoLembreteComponent } from './edicao-lembrete.component';

describe('EdicaoLembreteComponent', () => {
  let component: EdicaoLembreteComponent;
  let fixture: ComponentFixture<EdicaoLembreteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoLembreteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicaoLembreteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
