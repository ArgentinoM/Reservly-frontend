import { Component } from '@angular/core';
import { NavigateComponent } from "../../shared/components/navigate/navigate.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home-page-global',
  imports: [NavigateComponent, RouterLink],
  templateUrl: './home-page-global.component.html',
})
export class HomePageGlobalComponent {

    servicios = [
    {
      icon: 'fa-camera',
      titulo: 'Fotografía',
      descripcion: 'Sesiones profesionales, eventos y edición avanzada.'
    },
    {
      icon: 'fa-code',
      titulo: 'Desarrollo Web',
      descripcion: 'Sitios modernos, APIs, sistemas y ecommerce.'
    },
    {
      icon: 'fa-paintbrush',
      titulo: 'Diseño Gráfico',
      descripcion: 'Branding, logos, banners, identidades visuales.'
    }
  ];

  testimonios = [
    {
      text: '“Increíble servicio. Encontré un fotógrafo profesional en minutos.”',
      autor: 'Ana López'
    },
    {
      text: '“La plataforma es súper intuitiva, contraté un programador y quedé fascinado.”',
      autor: 'Carlos Méndez'
    },
    {
      text: '“Los diseñadores aquí son de otro nivel. 10/10”',
      autor: 'Sofía Rivas'
    }
  ];

}
