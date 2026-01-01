{
  description = "PewPew - A modern Progressive Web App";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            deno
            eslint
            gh
            prettier
            tailwindcss_4
            typescript-language-server
            watchman
          ];

          env = {
            DENO_DIR = ".deno";
            DENO_TLS_CA_STORE = "system";
          };
        };
      }
    );
}
