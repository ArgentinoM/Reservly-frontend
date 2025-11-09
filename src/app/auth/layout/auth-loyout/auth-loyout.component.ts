import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleAuthComponentComponent } from "../../components/title-auth-component/title-auth-component.component";

@Component({
  selector: 'app-auth-loyout',
  imports: [RouterOutlet, TitleAuthComponentComponent],
  templateUrl: './auth-loyout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLoyoutComponent { }
