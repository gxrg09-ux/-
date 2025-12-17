export interface TreeConfig {
  lightColor: string;
  ornamentColor: string;
  isRotating: boolean;
  intensity: number;
}

export interface GreetingRequest {
  recipient: string;
  tone: 'Royal' | 'Warm' | 'Mysterious';
}
