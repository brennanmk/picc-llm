{
  description = "PICC Flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          redis
          zlib
          nix-index
          dpkg
          cmake
          libmysqlclient

          python3
          python3Packages.black
          python3Packages.python-lsp-server
          python3Packages.pyflakes
          python3Packages.epc
          python3Packages.orjson
          python3Packages.sexpdata
          python3Packages.six
          python3Packages.setuptools
          python3Packages.paramiko
          python3Packages.rapidfuzz
          python3Packages.numpy
          python3Packages.mysqlclient
          python3Packages.watchdog
        ];

        shellHook = ''
          if [ -d ".venv" ]; then
            source .venv/bin/activate
          fi
        '';
      };
    };
}
