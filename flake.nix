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
            # Runtime and build tools
            deno

            # Node.js for npm packages (Tailwind, ESLint, Prettier)
            nodejs_20
            nodePackages.npm

            # Git for version control
            git

            # Optional but useful tools
            jq           # JSON processing
            curl         # HTTP requests
            watchexec    # File watching utility
          ];

          shellHook = ''
            echo "🚀 PewPew Development Environment"
            echo ""
            echo "Available tools:"
            echo "  Deno:    $(deno --version | head -n 1)"
            echo "  Node.js: $(node --version)"
            echo "  npm:     $(npm --version)"
            echo ""
            echo "Quick start:"
            echo "  npm install          # Install dev dependencies"
            echo "  deno task dev        # Start development server"
            echo "  deno task build      # Build for production"
            echo ""
            echo "📚 See README.md for more commands"
            echo ""

            # Set up npm to use local node_modules
            export PATH="$PWD/node_modules/.bin:$PATH"
          '';

          # Environment variables
          env = {
            DENO_DIR = ".deno";
            # Allow Deno to use the system's CA certificates
            DENO_TLS_CA_STORE = "system";
          };
        };
      }
    );
}
