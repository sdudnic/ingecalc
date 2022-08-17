import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { CalculatorService } from './calculator.service';
import { Properties } from './properties';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  subscription: Subscription = new Subscription();
  debounceTime = 500;

  paramsFormGroup: FormGroup;
  properties: Properties;

  constructor(private fb: FormBuilder, private calculator: CalculatorService) {
    this.paramsFormGroup = this.fb.group(this.properties);
  }

  ngOnInit(): void {
    this.functionToBeCalled();
    this.subscription.add(
      this.paramsFormGroup.valueChanges
        .pipe(debounceTime(this.debounceTime))
        .subscribe(() => {
          this.functionToBeCalled();
        })
    );
  }

  getControlLabel(type: string) {
    console.log(this.paramsFormGroup && this.paramsFormGroup.controls, type);
    if (
      this.paramsFormGroup &&
      this.paramsFormGroup.controls &&
      this.paramsFormGroup.controls[type]
    ) {
      return this.paramsFormGroup.controls[type].value;
    }
    return 0;
  }

  functionToBeCalled() {
    const { a, b } = this.paramsFormGroup.value;
    const newProperties = this.calculator.calculate({ a, b });
    this.paramsFormGroup.patchValue(newProperties);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
