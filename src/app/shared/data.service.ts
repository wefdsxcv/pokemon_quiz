import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pokemon {
  no: number;
  name: string;
  imagePath: string;
  region: string;
  form: string;
  isMegaEvolution: boolean;
  evolutions: number[];
  types: string[];
  abilities: string[];
  hiddenAbilities: string[];
  weaknesses: string[];
  status: {
    hp: number;
    attack: number;
    defence: number;
    spAttack: number;
    spDefence: number;
    speed: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly dataUrl = 'assets/pokemon.json';

  constructor(private readonly http: HttpClient) {}

  getPokemonList(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.dataUrl);
  }
}
