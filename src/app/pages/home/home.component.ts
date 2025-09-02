import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { Router, RouterModule, RouterLink } from '@angular/router';

import { ElementCard } from '../../shared/model/card';
import { Products } from '../../shared/model/product';
import { AccesoreisService } from '../../service/accesoreis.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TranslatePipe, RouterModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit, OnInit {
  private router = inject(Router);
  private productService = inject(AccesoreisService);
  products: Products[] = [];
  jewelOfTheDay!: Products;
  images = [
    { src: 'assets/images/slider1.png', alt: 'First Slide' },
    { src: 'assets/images/slider 2.png', alt: 'Second Slide' },
    { src: 'assets/images/slider3.png', alt: 'Third Slide' },
  ];
  elements = [
    {
      name: 'Fire',
      icon: 'bi-fire',
      value: 'fire',
      material: 'Gold',
      desc: 'Bold & radiant like flames',
    },
    {
      name: 'Water',
      icon: 'bi-droplet',
      value: 'water',
      material: 'Pearl',
      desc: 'Elegant & fluid as waves',
    },
    {
      name: 'Earth',
      icon: 'bi-tree',
      value: 'earth',
      material: 'Crystal',
      desc: 'Grounded with timeless gems',
    },
    {
      name: 'Air',
      icon: 'bi-cloud',
      value: 'air',
      material: 'Silver',
      desc: 'Light & dazzling brilliance',
    },
  ];
  collections = [
    {
      name: 'Rings Collection',
      description: 'Discover timeless rings designed for every occasion.',
      image:
        'https://res.cloudinary.com/ddsrofo4o/image/upload/v1756851147/Dainty_Rings_kwyfza.jpg',
      link: '/store/category/rings',
    },
    {
      name: 'Earrings Collection',
      description: 'Elegant earrings to add sparkle to your style.',
      image:
        'https://res.cloudinary.com/ddsrofo4o/image/upload/v1756852157/download_7_pgxrjq.jpg',
      link: '/store/earrings',
    },
    {
      name: 'Wedding Collection',
      description: 'Celebrate love with our special wedding pieces.',
      image:
        'https://res.cloudinary.com/ddsrofo4o/image/upload/v1756853037/dareth_colburn_xzfwry.jpg',
      // link: '/store/wedding',
    },
    {
      name: 'Special Collection',
      description: 'Shine bright with our premium special pieces.',
      image:
        'https://res.cloudinary.com/ddsrofo4o/image/upload/v1756852777/Copilot_20250903_013929_vysjgz.png',
      // link: '/store/diamond',
    },
  ];

  selectElement(element: ElementCard) {
    this.router.navigate(['/store/material', element.material]);
  }
  @ViewChild('video', { static: false })
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('tryOnModal') tryOnModalRef!: ElementRef;

  ngAfterViewInit() {
    const modalEl = this.tryOnModalRef.nativeElement;

    modalEl.addEventListener('shown.bs.modal', () => {
      this.startCamera();
    });

    modalEl.addEventListener('hidden.bs.modal', () => {
      this.stopCamera();
    });
  }

  cameraPermissionDenied = false;
  startCamera() {
    this.cameraPermissionDenied = false;

    if (!this.videoElement?.nativeElement) {
      console.warn('Video element not available');
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.videoElement.nativeElement.srcObject = stream;
        })
        .catch((err) => {
          console.error('Camera access denied:', err);
          this.cameraPermissionDenied = true;
        });
    } else {
      this.cameraPermissionDenied = true;
    }
  }
  stopCamera() {
    if (!this.videoElement || !this.videoElement.nativeElement) return;

    const stream = this.videoElement.nativeElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      this.videoElement.nativeElement.srcObject = null;
    }
  }
  ngOnInit(): void {
    this.productService.getAccesoreis().subscribe((data: Products[]) => {
      this.products = data;

      const todayIndex = new Date().getDate() % this.products.length;
      this.jewelOfTheDay = this.products[todayIndex];
    });
  }
}
