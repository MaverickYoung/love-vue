import { defineStore } from 'pinia';

export interface Poop {
  id: number;
  name: string;
  color: string;
  src: string;
}

const tmp: Poop[] = [
  {
    id: 1,
    color: '#7A4420',
    name: '健康便便',
    src: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgICAgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPg0KICAgIDxwYXRoIGQ9Ik0xMjAuMiA5NTZhMzkyLjEgNDAuMSAwIDEgMCA3ODQuMiAwIDM5Mi4xIDQwLjEgMCAxIDAtNzg0LjIgMHoiIGZpbGw9IiNFNUU1RTUiLz4NCiAgICA8cGF0aCBkPSJNODEzIDQ5NS4zYzE1LjctMTkuNiAyNS4xLTQ0LjEgMjUuMS03MC42IDAtNjQtNTQuNS0xMTYuNC0xMjEtMTE2LjRoLTEzYzExLTEwLjMgMTkuMi0yMy4yIDIzLjgtMzcuNyA5LTEzLjUgMTQuMy0yOS41IDE0LjMtNDYuNiAwLTQ3LjgtNDAuNi04Ni44LTkwLjItODYuOEg1MzAuOGMtMS45IDAtMjAuNy0zLjItMjIuMi00LjEtMTcuOC0xMC0xOS45LTMzLjQtMTkuOS01NC42IDAtNi42IDYuOS00Ni40IDcuOC01Mi43LTc1LjkgMTMuNy0xMzkuNyAxMTEtMTM5LjcgMTg4IDAgMzEuOSAxMS43IDc4LjQgMjguOCA5NC41aC03OC4xYy02Ni42IDAtMTIxIDUyLjQtMTIxIDExNi40IDAgMjYuNSA5LjQgNTEgMjUuMSA3MC42LTcxLjggMjAtMTI0LjggODQtMTI0LjggMTU5LjMgMCA5MS4yIDc3LjYgMTY1LjkgMTcyLjQgMTY1LjloNTA2LjJjOTQuOCAwIDE3Mi40LTc0LjYgMTcyLjQtMTY1LjkgMC03NS4zLTUzLTEzOS4zLTEyNC44LTE1OS4zeiINCiAgICAgICAgICBmaWxsPSIjRjJCOTg2Ii8+DQogICAgPHBhdGggZD0iTTc2NS40IDgzMC41SDI1OS4yYy00OC41IDAtOTQuMi0xOC4zLTEyOC43LTUxLjUtMzQuNi0zMy4zLTUzLjctNzcuNS01My43LTEyNC40IDAtMzguOCAxMy03NS43IDM3LjYtMTA2LjYgMjAuOS0yNi4yIDQ5LjMtNDYuNSA4MS4xLTU4LTEyLjUtMTkuNy0xOS00Mi0xOS02NS4zIDAtNjkuNyA1OC44LTEyNi40IDEzMS0xMjYuNGg1OC43Yy00LjktOS40LTguNi0xOS45LTExLjEtMjguNS01LjMtMTguNS04LjQtMzguOS04LjQtNTUuOSAwLTQwIDE1LjgtODUgNDMuMi0xMjMuNiAyOS4yLTQxIDY2LjQtNjcuNCAxMDQuNy03NC4zIDMuMi0wLjYgNi40IDAuNCA4LjcgMi43IDIuMyAyLjIgMy40IDUuNSAyLjkgOC42LTAuMiAxLjYtMC44IDQuOC0xLjUgOS4zLTEuNyAxMC4zLTYuMiAzNy42LTYuMiA0MS45IDAgMzEuOCA3IDQxLjEgMTQuMSA0NS40IDMuNiAwLjkgMTUuOCAzIDE4LjQgMy4zaDEyMWM1NS4zIDAgMTAwLjIgNDMuNCAxMDAuMiA5Ni44IDAgMTgtNS4zIDM1LjYtMTUuMiA1MS0yLjggOC4zLTYuNyAxNi4yLTExLjYgMjMuNSA2OC40IDQuMiAxMjIuNyA1OS4yIDEyMi43IDEyNi4yIDAgMjMuMi02LjUgNDUuNS0xOSA2NS4zIDMxLjggMTEuNiA2MC4yIDMxLjggODEuMSA1OCAyNC42IDMwLjkgMzcuNiA2Ny44IDM3LjYgMTA2LjYgMCA0Ni45LTE5LjEgOTEtNTMuNyAxMjQuNC0zNC42IDMzLjItODAuMyA1MS41LTEyOC43IDUxLjV6TTMwNy41IDMxOC4zYy02MS4yIDAtMTExIDQ3LjctMTExIDEwNi40IDAgMjMuMyA3LjkgNDUuNiAyMi45IDY0LjQgMi4xIDIuNiAyLjcgNi4xIDEuNyA5LjMtMSAzLjItMy42IDUuNy02LjggNi42LTY5LjIgMTkuMy0xMTcuNSA4MC44LTExNy41IDE0OS43IDAgNDEuNCAxNi45IDgwLjQgNDcuNiAxMDkuOSAzMC44IDI5LjYgNzEuNiA0NS45IDExNC44IDQ1LjloNTA2LjJjNDMuMyAwIDg0LTE2LjMgMTE0LjgtNDUuOSAzMC43LTI5LjUgNDcuNi02OC42IDQ3LjYtMTA5LjkgMC02OC45LTQ4LjMtMTMwLjQtMTE3LjUtMTQ5LjctMy4yLTAuOS01LjgtMy40LTYuOC02LjYtMS0zLjItMC40LTYuNyAxLjctOS4zIDE1LTE4LjggMjIuOS00MSAyMi45LTY0LjQgMC01OC43LTQ5LjgtMTA2LjQtMTExLTEwNi40aC0xM2MtNC4xIDAtNy44LTIuNS05LjMtNi4zLTEuNS0zLjgtMC41LTguMiAyLjQtMTEgOS44LTkuMiAxNy4xLTIwLjggMjEuMS0zMy40IDAuMy0wLjkgMC43LTEuOCAxLjItMi41IDguMy0xMi40IDEyLjYtMjYuNiAxMi42LTQxLjEgMC00Mi40LTM2LTc2LjgtODAuMi03Ni44SDUzMC44Yy0xLjUgMC0yMi45LTMtMjcuMS01LjQtMjIuMS0xMi40LTI1LTM5LTI1LTYzLjMgMC00LjUgMi0xNy44IDUuNS0zOS4yLTI4IDkuNC01NS43IDMxLjYtNzcuOCA2Mi42LTI0LjcgMzQuNy0zOS41IDc2LjYtMzkuNSAxMTIgMCAzMyAxMi4yIDc0LjYgMjUuNiA4Ny4yIDMgMi44IDQgNy4yIDIuNCAxMS0xLjUgMy44LTUuMiA2LjMtOS4zIDYuM2gtNzguMXoiDQogICAgICAgICAgZmlsbD0iIzIzMTgxNSIvPg0KICAgIDxwYXRoIGQ9Ik05MzcuOCA2NTQuNmMwLTc1LjMtNTIuOS0xMzkuMy0xMjQuOC0xNTkuMyAxNS43LTE5LjYgMjUuMS00NC4xIDI1LjEtNzAuNiAwLTY0LTU0LjUtMTE2LjQtMTIxLTExNi40aC0xM2MxMS0xMC4zIDE5LjItMjMuMiAyMy44LTM3LjcgOS0xMy41IDE0LjMtMjkuNSAxNC4zLTQ2LjYgMC0xNi43LTUuMS0zMi4zLTEzLjctNDUuNiAwIDAtMjYuMS0zNy40LTExNi00MS4yaC04MS44Yy0wLjggMC00LjQtMC41LTguNC0xLjItMjYgMzUuOC00Mi4zIDgwLTQyLjMgMTE5IDAgMzEuOSAxMS43IDc4LjQgMjguOCA5NC41aC03OC4xYy02Ni42IDAtMTIxIDUyLjQtMTIxIDExNi40IDAgMjYuNSA5LjQgNTEgMjUuMSA3MC42LTcxLjggMjAtMTI0LjggODQtMTI0LjggMTU5LjMgMCA0OS42IDIyLjkgOTQuMiA1OSAxMjQuN2g0OTYuM2M5NC45IDAgMTcyLjUtNzQuNiAxNzIuNS0xNjUuOXoiDQogICAgICAgICAgZmlsbD0iI0EwNjgzRiIvPg0KICAgIDxwYXRoIGQ9Ik03NjUuNCA4MzAuNUgyNTkuMmMtNDguNSAwLTk0LjItMTguMy0xMjguNy01MS41LTM0LjYtMzMuMy01My43LTc3LjUtNTMuNy0xMjQuNCAwLTM4LjggMTMtNzUuNyAzNy42LTEwNi42IDIwLjktMjYuMiA0OS4zLTQ2LjUgODEuMS01OC0xMi41LTE5LjctMTktNDItMTktNjUuMyAwLTY5LjcgNTguOC0xMjYuNCAxMzEtMTI2LjRoNTguN2MtNC45LTkuNC04LjYtMTkuOS0xMS4xLTI4LjUtNS4zLTE4LjUtOC40LTM4LjktOC40LTU1LjkgMC00MCAxNS44LTg1IDQzLjItMTIzLjYgMjkuMi00MSA2Ni40LTY3LjQgMTA0LjctNzQuMyAzLjItMC42IDYuNCAwLjQgOC43IDIuNyAyLjMgMi4yIDMuNCA1LjUgMi45IDguNi0wLjIgMS42LTAuOCA0LjgtMS41IDkuMy0xLjcgMTAuMy02LjIgMzcuNi02LjIgNDEuOSAwIDMxLjggNyA0MS4xIDE0LjEgNDUuNCAzLjYgMC45IDE1LjggMyAxOC40IDMuM2gxMjFjNTUuMyAwIDEwMC4yIDQzLjQgMTAwLjIgOTYuOCAwIDE4LTUuMyAzNS42LTE1LjIgNTEtMi44IDguMy02LjcgMTYuMi0xMS42IDIzLjUgNjguNCA0LjIgMTIyLjcgNTkuMiAxMjIuNyAxMjYuMiAwIDIzLjItNi41IDQ1LjUtMTkgNjUuMyAzMS44IDExLjYgNjAuMiAzMS44IDgxLjEgNTggMjQuNiAzMC45IDM3LjYgNjcuOCAzNy42IDEwNi42IDAgNDYuOS0xOS4xIDkxLTUzLjcgMTI0LjQtMzQuNiAzMy4yLTgwLjMgNTEuNS0xMjguNyA1MS41ek0zMDcuNSAzMTguM2MtNjEuMiAwLTExMSA0Ny43LTExMSAxMDYuNCAwIDIzLjMgNy45IDQ1LjYgMjIuOSA2NC40IDIuMSAyLjYgMi43IDYuMSAxLjcgOS4zLTEgMy4yLTMuNiA1LjctNi44IDYuNi02OS4yIDE5LjMtMTE3LjUgODAuOC0xMTcuNSAxNDkuNyAwIDQxLjQgMTYuOSA4MC40IDQ3LjYgMTA5LjkgMzAuOCAyOS42IDcxLjYgNDUuOSAxMTQuOCA0NS45aDUwNi4yYzQzLjMgMCA4NC0xNi4zIDExNC44LTQ1LjkgMzAuNy0yOS41IDQ3LjYtNjguNiA0Ny42LTEwOS45IDAtNjguOS00OC4zLTEzMC40LTExNy41LTE0OS43LTMuMi0wLjktNS44LTMuNC02LjgtNi42LTEtMy4yLTAuNC02LjcgMS43LTkuMyAxNS0xOC44IDIyLjktNDEgMjIuOS02NC40IDAtNTguNy00OS44LTEwNi40LTExMS0xMDYuNGgtMTNjLTQuMSAwLTcuOC0yLjUtOS4zLTYuMy0xLjUtMy44LTAuNS04LjIgMi40LTExIDkuOC05LjIgMTcuMS0yMC44IDIxLjEtMzMuNCAwLjMtMC45IDAuNy0xLjggMS4yLTIuNSA4LjMtMTIuNCAxMi42LTI2LjYgMTIuNi00MS4xIDAtNDIuNC0zNi03Ni44LTgwLjItNzYuOEg1MzAuOGMtMS41IDAtMjIuOS0zLTI3LjEtNS40LTIyLjEtMTIuNC0yNS0zOS0yNS02My4zIDAtNC41IDItMTcuOCA1LjUtMzkuMi0yOCA5LjQtNTUuNyAzMS42LTc3LjggNjIuNi0yNC43IDM0LjctMzkuNSA3Ni42LTM5LjUgMTEyIDAgMzMgMTIuMiA3NC42IDI1LjYgODcuMiAzIDIuOCA0IDcuMiAyLjQgMTEtMS41IDMuOC01LjIgNi4zLTkuMyA2LjNoLTc4LjF6Ig0KICAgICAgICAgIGZpbGw9IiMyMzE4MTUiLz4NCiAgICA8cGF0aCBkPSJNMzA2LjEgNTE5LjlhMjYuMiAyNi4yIDAgMSAwIDUyLjQgMCAyNi4yIDI2LjIgMCAxIDAtNTIuNCAwek02NjYgNTE5LjlhMjYuMiAyNi4yIDAgMSAwIDUyLjQgMCAyNi4yIDI2LjIgMCAxIDAtNTIuNCAweiINCiAgICAgICAgICBmaWxsPSIjMjMxODE1Ii8+DQogICAgPHBhdGggZD0iTTUxMi4zIDY0Mi40Yy00OC42IDAtOTQuMS01LjgtMTMzLjItMTUuOC0xNC4xLTMuNi0yNy41IDguNC0yNC40IDIyLjEgMTUuNSA3MC4yIDgwLjEgMTIyLjkgMTU3LjYgMTIyLjlzMTQyLjItNTIuNyAxNTcuNi0xMjIuOWMzLTEzLjgtMTAuMy0yNS44LTI0LjQtMjIuMS0zOS4yIDEwLTg0LjYgMTUuOC0xMzMuMiAxNS44eiINCiAgICAgICAgICBmaWxsPSIjRkZBNkQ3Ii8+DQogICAgPHBhdGggZD0iTTUxMi4zIDc4MS42Yy0zOS40IDAtNzcuOC0xMy4yLTEwOC4zLTM3LjMtMzAuMS0yMy44LTUxLjEtNTctNTkuMS05My41LTIuMS05LjYgMC45LTE5LjUgOC4xLTI2LjUgNy42LTcuMyAxOC4zLTEwLjEgMjguNi03LjUgMzkuNSAxMC4xIDg0LjcgMTUuNSAxMzAuNyAxNS41IDQ2IDAgOTEuMi01LjQgMTMwLjctMTUuNSAxMC4zLTIuNiAyMSAwLjIgMjguNiA3LjUgNy4yIDcgMTAuMiAxNi45IDguMSAyNi41LTggMzYuNS0yOSA2OS43LTU5LjEgOTMuNS0zMC41IDI0LTY4LjkgMzcuMy0xMDguMyAzNy4zek0zNzQgNjM1LjljLTIuNiAwLTUuMSAxLTcuMSAyLjktMS4zIDEuMy0zLjMgMy45LTIuNSA3LjggNy4xIDMyIDI1LjUgNjEuMiA1MiA4Mi4xIDI2LjkgMjEuMyA2MSAzMyA5NS45IDMzczY5LTExLjcgOTUuOS0zM2MyNi41LTIwLjkgNDQuOS01MC4xIDUyLTgyLjEgMC45LTMuOS0xLjItNi41LTIuNS03LjgtMi42LTIuNS02LjItMy40LTkuNy0yLjUtNDEuMSAxMC42LTg4IDE2LjEtMTM1LjcgMTYuMS00Ny43IDAtOTQuNi01LjYtMTM1LjctMTYuMS0wLjktMC4zLTEuOC0wLjQtMi42LTAuNHoiDQogICAgICAgICAgZmlsbD0iIzIzMTgxNSIvPg0KICAgIDxwYXRoIGQ9Ik02MTUuOSA3MzUuMmMtMjgtMjIuNy02NC4yLTM2LjQtMTAzLjctMzYuNHMtNzUuNiAxMy43LTEwMy43IDM2LjRjMjggMjIuNyA2NC4yIDM2LjQgMTAzLjcgMzYuNHM3NS43LTEzLjcgMTAzLjctMzYuNHoiDQogICAgICAgICAgZmlsbD0iI0ZGNjZDMSIvPg0KICAgIDxwYXRoIGQ9Ik01MTIuMyA3ODEuNmMtNDAuMiAwLTc5LjItMTMuNy0xMTAtMzguNy0yLjMtMS45LTMuNy00LjgtMy43LTcuOHMxLjQtNS45IDMuNy03LjhjMzAuNy0yNC45IDY5LjgtMzguNyAxMTAtMzguN3M3OS4yIDEzLjcgMTEwIDM4LjdjMi4zIDEuOSAzLjcgNC44IDMuNyA3LjhzLTEuNCA1LjktMy43IDcuOGMtMzAuOCAyNS02OS45IDM4LjctMTEwIDM4Ljd6IG0tODYuOS00Ni40YzI1LjMgMTcuMSA1NS43IDI2LjQgODYuOSAyNi40czYxLjUtOS4zIDg2LjktMjYuNGMtMjUuMy0xNy4xLTU1LjctMjYuNC04Ni45LTI2LjRzLTYxLjYgOS4yLTg2LjkgMjYuNHoiDQogICAgICAgICAgZmlsbD0iIzIzMTgxNSIvPg0KICAgIDxwYXRoIGQ9Ik0yMjQuNiA2MjdhNDQuMiAyNy40IDAgMSAwIDg4LjQgMCA0NC4yIDI3LjQgMCAxIDAtODguNCAwek03MDguNiA2MjdhNDQuMiAyNy40IDAgMSAwIDg4LjQgMCA0NC4yIDI3LjQgMCAxIDAtODguNCAweiINCiAgICAgICAgICBmaWxsPSIjN0E0NDIwIi8+DQo8L3N2Zz4='
  },
  {
    id: 2,
    color: '#d60808',
    name: '火辣便便',
    src: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPg0KICAgIDxwYXRoIGQ9Ik0xMjAuMiA5NTZhMzkyLjEgNDAuMSAwIDEgMCA3ODQuMiAwIDM5Mi4xIDQwLjEgMCAxIDAtNzg0LjIgMHoiIGZpbGw9IiNFNUU1RTUiLz4NCiAgICA8cGF0aCBkPSJNODEzIDQ5NS4zYzE1LjctMTkuNiAyNS4xLTQ0LjEgMjUuMS03MC42IDAtNjQtNTQuNS0xMTYuNC0xMjEtMTE2LjRoLTEzYzExLTEwLjMgMTkuMi0yMy4yIDIzLjgtMzcuNyA5LTEzLjUgMTQuMy0yOS41IDE0LjMtNDYuNiAwLTQ3LjgtNDAuNi04Ni44LTkwLjItODYuOEg1MzAuOGMtMS45IDAtMjAuNy0zLjItMjIuMi00LjEtMTcuOC0xMC0xOS45LTMzLjQtMTkuOS01NC42IDAtNi42IDYuOS00Ni40IDcuOC01Mi43LTc1LjkgMTMuNy0xMzkuNyAxMTEtMTM5LjcgMTg4IDAgMzEuOSAxMS43IDc4LjQgMjguOCA5NC41aC03OC4xYy02Ni42IDAtMTIxIDUyLjQtMTIxIDExNi40IDAgMjYuNSA5LjQgNTEgMjUuMSA3MC42LTcxLjggMjAtMTI0LjggODQtMTI0LjggMTU5LjMgMCA5MS4yIDc3LjYgMTY1LjkgMTcyLjQgMTY1LjloNTA2LjJjOTQuOCAwIDE3Mi40LTc0LjYgMTcyLjQtMTY1LjkgMC03NS4zLTUzLTEzOS4zLTEyNC44LTE1OS4zeiINCiAgICAgICAgICBmaWxsPSIjZjE4ZjhmIi8+DQogICAgPHBhdGggZD0iTTc2NS40IDgzMC41SDI1OS4yYy00OC41IDAtOTQuMi0xOC4zLTEyOC43LTUxLjUtMzQuNi0zMy4zLTUzLjctNzcuNS01My43LTEyNC40IDAtMzguOCAxMy03NS43IDM3LjYtMTA2LjYgMjAuOS0yNi4yIDQ5LjMtNDYuNSA4MS4xLTU4LTEyLjUtMTkuNy0xOS00Mi0xOS02NS4zIDAtNjkuNyA1OC44LTEyNi40IDEzMS0xMjYuNGg1OC43Yy00LjktOS40LTguNi0xOS45LTExLjEtMjguNS01LjMtMTguNS04LjQtMzguOS04LjQtNTUuOSAwLTQwIDE1LjgtODUgNDMuMi0xMjMuNiAyOS4yLTQxIDY2LjQtNjcuNCAxMDQuNy03NC4zIDMuMi0wLjYgNi40IDAuNCA4LjcgMi43IDIuMyAyLjIgMy40IDUuNSAyLjkgOC42LTAuMiAxLjYtMC44IDQuOC0xLjUgOS4zLTEuNyAxMC4zLTYuMiAzNy42LTYuMiA0MS45IDAgMzEuOCA3IDQxLjEgMTQuMSA0NS40IDMuNiAwLjkgMTUuOCAzIDE4LjQgMy4zaDEyMWM1NS4zIDAgMTAwLjIgNDMuNCAxMDAuMiA5Ni44IDAgMTgtNS4zIDM1LjYtMTUuMiA1MS0yLjggOC4zLTYuNyAxNi4yLTExLjYgMjMuNSA2OC40IDQuMiAxMjIuNyA1OS4yIDEyMi43IDEyNi4yIDAgMjMuMi02LjUgNDUuNS0xOSA2NS4zIDMxLjggMTEuNiA2MC4yIDMxLjggODEuMSA1OCAyNC42IDMwLjkgMzcuNiA2Ny44IDM3LjYgMTA2LjYgMCA0Ni45LTE5LjEgOTEtNTMuNyAxMjQuNC0zNC42IDMzLjItODAuMyA1MS41LTEyOC43IDUxLjV6TTMwNy41IDMxOC4zYy02MS4yIDAtMTExIDQ3LjctMTExIDEwNi40IDAgMjMuMyA3LjkgNDUuNiAyMi45IDY0LjQgMi4xIDIuNiAyLjcgNi4xIDEuNyA5LjMtMSAzLjItMy42IDUuNy02LjggNi42LTY5LjIgMTkuMy0xMTcuNSA4MC44LTExNy41IDE0OS43IDAgNDEuNCAxNi45IDgwLjQgNDcuNiAxMDkuOSAzMC44IDI5LjYgNzEuNiA0NS45IDExNC44IDQ1LjloNTA2LjJjNDMuMyAwIDg0LTE2LjMgMTE0LjgtNDUuOSAzMC43LTI5LjUgNDcuNi02OC42IDQ3LjYtMTA5LjkgMC02OC45LTQ4LjMtMTMwLjQtMTE3LjUtMTQ5LjctMy4yLTAuOS01LjgtMy40LTYuOC02LjYtMS0zLjItMC40LTYuNyAxLjctOS4zIDE1LTE4LjggMjIuOS00MSAyMi45LTY0LjQgMC01OC43LTQ5LjgtMTA2LjQtMTExLTEwNi40aC0xM2MtNC4xIDAtNy44LTIuNS05LjMtNi4zLTEuNS0zLjgtMC41LTguMiAyLjQtMTEgOS44LTkuMiAxNy4xLTIwLjggMjEuMS0zMy40IDAuMy0wLjkgMC43LTEuOCAxLjItMi41IDguMy0xMi40IDEyLjYtMjYuNiAxMi42LTQxLjEgMC00Mi40LTM2LTc2LjgtODAuMi03Ni44SDUzMC44Yy0xLjUgMC0yMi45LTMtMjcuMS01LjQtMjIuMS0xMi40LTI1LTM5LTI1LTYzLjMgMC00LjUgMi0xNy44IDUuNS0zOS4yLTI4IDkuNC01NS43IDMxLjYtNzcuOCA2Mi42LTI0LjcgMzQuNy0zOS41IDc2LjYtMzkuNSAxMTIgMCAzMyAxMi4yIDc0LjYgMjUuNiA4Ny4yIDMgMi44IDQgNy4yIDIuNCAxMS0xLjUgMy44LTUuMiA2LjMtOS4zIDYuM2gtNzguMXoiDQogICAgICAgICAgZmlsbD0iIzIzMTgxNSIvPg0KICAgIDxwYXRoIGQ9Ik05MzcuOCA2NTQuNmMwLTc1LjMtNTIuOS0xMzkuMy0xMjQuOC0xNTkuMyAxNS43LTE5LjYgMjUuMS00NC4xIDI1LjEtNzAuNiAwLTY0LTU0LjUtMTE2LjQtMTIxLTExNi40aC0xM2MxMS0xMC4zIDE5LjItMjMuMiAyMy44LTM3LjcgOS0xMy41IDE0LjMtMjkuNSAxNC4zLTQ2LjYgMC0xNi43LTUuMS0zMi4zLTEzLjctNDUuNiAwIDAtMjYuMS0zNy40LTExNi00MS4yaC04MS44Yy0wLjggMC00LjQtMC41LTguNC0xLjItMjYgMzUuOC00Mi4zIDgwLTQyLjMgMTE5IDAgMzEuOSAxMS43IDc4LjQgMjguOCA5NC41aC03OC4xYy02Ni42IDAtMTIxIDUyLjQtMTIxIDExNi40IDAgMjYuNSA5LjQgNTEgMjUuMSA3MC42LTcxLjggMjAtMTI0LjggODQtMTI0LjggMTU5LjMgMCA0OS42IDIyLjkgOTQuMiA1OSAxMjQuN2g0OTYuM2M5NC45IDAgMTcyLjUtNzQuNiAxNzIuNS0xNjUuOXoiDQogICAgICAgICAgZmlsbD0iI2NjNTE1MSIgY2xhc3M9InNlbGVjdGVkIi8+DQogICAgPHBhdGggZD0iTTc2NS40IDgzMC41SDI1OS4yYy00OC41IDAtOTQuMi0xOC4zLTEyOC43LTUxLjUtMzQuNi0zMy4zLTUzLjctNzcuNS01My43LTEyNC40IDAtMzguOCAxMy03NS43IDM3LjYtMTA2LjYgMjAuOS0yNi4yIDQ5LjMtNDYuNSA4MS4xLTU4LTEyLjUtMTkuNy0xOS00Mi0xOS02NS4zIDAtNjkuNyA1OC44LTEyNi40IDEzMS0xMjYuNGg1OC43Yy00LjktOS40LTguNi0xOS45LTExLjEtMjguNS01LjMtMTguNS04LjQtMzguOS04LjQtNTUuOSAwLTQwIDE1LjgtODUgNDMuMi0xMjMuNiAyOS4yLTQxIDY2LjQtNjcuNCAxMDQuNy03NC4zIDMuMi0wLjYgNi40IDAuNCA4LjcgMi43IDIuMyAyLjIgMy40IDUuNSAyLjkgOC42LTAuMiAxLjYtMC44IDQuOC0xLjUgOS4zLTEuNyAxMC4zLTYuMiAzNy42LTYuMiA0MS45IDAgMzEuOCA3IDQxLjEgMTQuMSA0NS40IDMuNiAwLjkgMTUuOCAzIDE4LjQgMy4zaDEyMWM1NS4zIDAgMTAwLjIgNDMuNCAxMDAuMiA5Ni44IDAgMTgtNS4zIDM1LjYtMTUuMiA1MS0yLjggOC4zLTYuNyAxNi4yLTExLjYgMjMuNSA2OC40IDQuMiAxMjIuNyA1OS4yIDEyMi43IDEyNi4yIDAgMjMuMi02LjUgNDUuNS0xOSA2NS4zIDMxLjggMTEuNiA2MC4yIDMxLjggODEuMSA1OCAyNC42IDMwLjkgMzcuNiA2Ny44IDM3LjYgMTA2LjYgMCA0Ni45LTE5LjEgOTEtNTMuNyAxMjQuNC0zNC42IDMzLjItODAuMyA1MS41LTEyOC43IDUxLjV6TTMwNy41IDMxOC4zYy02MS4yIDAtMTExIDQ3LjctMTExIDEwNi40IDAgMjMuMyA3LjkgNDUuNiAyMi45IDY0LjQgMi4xIDIuNiAyLjcgNi4xIDEuNyA5LjMtMSAzLjItMy42IDUuNy02LjggNi42LTY5LjIgMTkuMy0xMTcuNSA4MC44LTExNy41IDE0OS43IDAgNDEuNCAxNi45IDgwLjQgNDcuNiAxMDkuOSAzMC44IDI5LjYgNzEuNiA0NS45IDExNC44IDQ1LjloNTA2LjJjNDMuMyAwIDg0LTE2LjMgMTE0LjgtNDUuOSAzMC43LTI5LjUgNDcuNi02OC42IDQ3LjYtMTA5LjkgMC02OC45LTQ4LjMtMTMwLjQtMTE3LjUtMTQ5LjctMy4yLTAuOS01LjgtMy40LTYuOC02LjYtMS0zLjItMC40LTYuNyAxLjctOS4zIDE1LTE4LjggMjIuOS00MSAyMi45LTY0LjQgMC01OC43LTQ5LjgtMTA2LjQtMTExLTEwNi40aC0xM2MtNC4xIDAtNy44LTIuNS05LjMtNi4zLTEuNS0zLjgtMC41LTguMiAyLjQtMTEgOS44LTkuMiAxNy4xLTIwLjggMjEuMS0zMy40IDAuMy0wLjkgMC43LTEuOCAxLjItMi41IDguMy0xMi40IDEyLjYtMjYuNiAxMi42LTQxLjEgMC00Mi40LTM2LTc2LjgtODAuMi03Ni44SDUzMC44Yy0xLjUgMC0yMi45LTMtMjcuMS01LjQtMjIuMS0xMi40LTI1LTM5LTI1LTYzLjMgMC00LjUgMi0xNy44IDUuNS0zOS4yLTI4IDkuNC01NS43IDMxLjYtNzcuOCA2Mi42LTI0LjcgMzQuNy0zOS41IDc2LjYtMzkuNSAxMTIgMCAzMyAxMi4yIDc0LjYgMjUuNiA4Ny4yIDMgMi44IDQgNy4yIDIuNCAxMS0xLjUgMy44LTUuMiA2LjMtOS4zIDYuM2gtNzguMXoiDQogICAgICAgICAgZmlsbD0iIzIzMTgxNSIvPg0KICAgIDxwYXRoIGQ9Ik0zMDYuMSA1MTkuOWEyNi4yIDI2LjIgMCAxIDAgNTIuNCAwIDI2LjIgMjYuMiAwIDEgMC01Mi40IDB6TTY2NiA1MTkuOWEyNi4yIDI2LjIgMCAxIDAgNTIuNCAwIDI2LjIgMjYuMiAwIDEgMC01Mi40IDB6Ig0KICAgICAgICAgIGZpbGw9IiMyMzE4MTUiLz4NCiAgICA8cGF0aCBkPSJNNTEyLjMgNjQyLjRjLTQ4LjYgMC05NC4xLTUuOC0xMzMuMi0xNS44LTE0LjEtMy42LTI3LjUgOC40LTI0LjQgMjIuMSAxNS41IDcwLjIgODAuMSAxMjIuOSAxNTcuNiAxMjIuOXMxNDIuMi01Mi43IDE1Ny42LTEyMi45YzMtMTMuOC0xMC4zLTI1LjgtMjQuNC0yMi4xLTM5LjIgMTAtODQuNiAxNS44LTEzMy4yIDE1Ljh6Ig0KICAgICAgICAgIGZpbGw9IiNGRkE2RDciLz4NCiAgICA8cGF0aCBkPSJNNTEyLjMgNzgxLjZjLTM5LjQgMC03Ny44LTEzLjItMTA4LjMtMzcuMy0zMC4xLTIzLjgtNTEuMS01Ny01OS4xLTkzLjUtMi4xLTkuNiAwLjktMTkuNSA4LjEtMjYuNSA3LjYtNy4zIDE4LjMtMTAuMSAyOC42LTcuNSAzOS41IDEwLjEgODQuNyAxNS41IDEzMC43IDE1LjUgNDYgMCA5MS4yLTUuNCAxMzAuNy0xNS41IDEwLjMtMi42IDIxIDAuMiAyOC42IDcuNSA3LjIgNyAxMC4yIDE2LjkgOC4xIDI2LjUtOCAzNi41LTI5IDY5LjctNTkuMSA5My41LTMwLjUgMjQtNjguOSAzNy4zLTEwOC4zIDM3LjN6TTM3NCA2MzUuOWMtMi42IDAtNS4xIDEtNy4xIDIuOS0xLjMgMS4zLTMuMyAzLjktMi41IDcuOCA3LjEgMzIgMjUuNSA2MS4yIDUyIDgyLjEgMjYuOSAyMS4zIDYxIDMzIDk1LjkgMzNzNjktMTEuNyA5NS45LTMzYzI2LjUtMjAuOSA0NC45LTUwLjEgNTItODIuMSAwLjktMy45LTEuMi02LjUtMi41LTcuOC0yLjYtMi41LTYuMi0zLjQtOS43LTIuNS00MS4xIDEwLjYtODggMTYuMS0xMzUuNyAxNi4xLTQ3LjcgMC05NC42LTUuNi0xMzUuNy0xNi4xLTAuOS0wLjMtMS44LTAuNC0yLjYtMC40eiINCiAgICAgICAgICBmaWxsPSIjMjMxODE1Ii8+DQogICAgPHBhdGggZD0iTTYxNS45IDczNS4yYy0yOC0yMi43LTY0LjItMzYuNC0xMDMuNy0zNi40cy03NS42IDEzLjctMTAzLjcgMzYuNGMyOCAyMi43IDY0LjIgMzYuNCAxMDMuNyAzNi40czc1LjctMTMuNyAxMDMuNy0zNi40eiINCiAgICAgICAgICBmaWxsPSIjRkY2NkMxIi8+DQogICAgPHBhdGggZD0iTTUxMi4zIDc4MS42Yy00MC4yIDAtNzkuMi0xMy43LTExMC0zOC43LTIuMy0xLjktMy43LTQuOC0zLjctNy44czEuNC01LjkgMy43LTcuOGMzMC43LTI0LjkgNjkuOC0zOC43IDExMC0zOC43czc5LjIgMTMuNyAxMTAgMzguN2MyLjMgMS45IDMuNyA0LjggMy43IDcuOHMtMS40IDUuOS0zLjcgNy44Yy0zMC44IDI1LTY5LjkgMzguNy0xMTAgMzguN3ogbS04Ni45LTQ2LjRjMjUuMyAxNy4xIDU1LjcgMjYuNCA4Ni45IDI2LjRzNjEuNS05LjMgODYuOS0yNi40Yy0yNS4zLTE3LjEtNTUuNy0yNi40LTg2LjktMjYuNHMtNjEuNiA5LjItODYuOSAyNi40eiINCiAgICAgICAgICBmaWxsPSIjMjMxODE1Ii8+DQogICAgPHBhdGggZD0iTTIyNC42IDYyN2E0NC4yIDI3LjQgMCAxIDAgODguNCAwIDQ0LjIgMjcuNCAwIDEgMC04OC40IDB6TTcwOC42IDYyN2E0NC4yIDI3LjQgMCAxIDAgODguNCAwIDQ0LjIgMjcuNCAwIDEgMC04OC40IDB6Ig0KICAgICAgICAgIGZpbGw9IiNmMTk4YjYiLz4NCjwvc3ZnPg=='
  },
  {
    id: 3,
    color: '#66a3ff',
    name: '水样便便',
    src: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaWQ9Im14X25fMTczMDcyMzczODg5MSINCiAgICAgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPg0KICAgIDxwYXRoIGQ9Ik0xMjAuMiA5NTZhMzkyLjEgNDAuMSAwIDEgMCA3ODQuMiAwIDM5Mi4xIDQwLjEgMCAxIDAtNzg0LjIgMHoiIGZpbGw9IiNFNUU1RTUiLz4NCiAgICA8cGF0aCBkPSJNODEzIDQ5NS4zYzE1LjctMTkuNiAyNS4xLTQ0LjEgMjUuMS03MC42IDAtNjQtNTQuNS0xMTYuNC0xMjEtMTE2LjRoLTEzYzExLTEwLjMgMTkuMi0yMy4yIDIzLjgtMzcuNyA5LTEzLjUgMTQuMy0yOS41IDE0LjMtNDYuNiAwLTQ3LjgtNDAuNi04Ni44LTkwLjItODYuOEg1MzAuOGMtMS45IDAtMjAuNy0zLjItMjIuMi00LjEtMTcuOC0xMC0xOS45LTMzLjQtMTkuOS01NC42IDAtNi42IDYuOS00Ni40IDcuOC01Mi43LTc1LjkgMTMuNy0xMzkuNyAxMTEtMTM5LjcgMTg4IDAgMzEuOSAxMS43IDc4LjQgMjguOCA5NC41aC03OC4xYy02Ni42IDAtMTIxIDUyLjQtMTIxIDExNi40IDAgMjYuNSA5LjQgNTEgMjUuMSA3MC42LTcxLjggMjAtMTI0LjggODQtMTI0LjggMTU5LjMgMCA5MS4yIDc3LjYgMTY1LjkgMTcyLjQgMTY1LjloNTA2LjJjOTQuOCAwIDE3Mi40LTc0LjYgMTcyLjQtMTY1LjkgMC03NS4zLTUzLTEzOS4zLTEyNC44LTE1OS4zeiINCiAgICAgICAgICBmaWxsPSIjN2ZjYmYzIi8+DQogICAgPHBhdGggZD0iTTc2NS40IDgzMC41SDI1OS4yYy00OC41IDAtOTQuMi0xOC4zLTEyOC43LTUxLjUtMzQuNi0zMy4zLTUzLjctNzcuNS01My43LTEyNC40IDAtMzguOCAxMy03NS43IDM3LjYtMTA2LjYgMjAuOS0yNi4yIDQ5LjMtNDYuNSA4MS4xLTU4LTEyLjUtMTkuNy0xOS00Mi0xOS02NS4zIDAtNjkuNyA1OC44LTEyNi40IDEzMS0xMjYuNGg1OC43Yy00LjktOS40LTguNi0xOS45LTExLjEtMjguNS01LjMtMTguNS04LjQtMzguOS04LjQtNTUuOSAwLTQwIDE1LjgtODUgNDMuMi0xMjMuNiAyOS4yLTQxIDY2LjQtNjcuNCAxMDQuNy03NC4zIDMuMi0wLjYgNi40IDAuNCA4LjcgMi43IDIuMyAyLjIgMy40IDUuNSAyLjkgOC42LTAuMiAxLjYtMC44IDQuOC0xLjUgOS4zLTEuNyAxMC4zLTYuMiAzNy42LTYuMiA0MS45IDAgMzEuOCA3IDQxLjEgMTQuMSA0NS40IDMuNiAwLjkgMTUuOCAzIDE4LjQgMy4zaDEyMWM1NS4zIDAgMTAwLjIgNDMuNCAxMDAuMiA5Ni44IDAgMTgtNS4zIDM1LjYtMTUuMiA1MS0yLjggOC4zLTYuNyAxNi4yLTExLjYgMjMuNSA2OC40IDQuMiAxMjIuNyA1OS4yIDEyMi43IDEyNi4yIDAgMjMuMi02LjUgNDUuNS0xOSA2NS4zIDMxLjggMTEuNiA2MC4yIDMxLjggODEuMSA1OCAyNC42IDMwLjkgMzcuNiA2Ny44IDM3LjYgMTA2LjYgMCA0Ni45LTE5LjEgOTEtNTMuNyAxMjQuNC0zNC42IDMzLjItODAuMyA1MS41LTEyOC43IDUxLjV6TTMwNy41IDMxOC4zYy02MS4yIDAtMTExIDQ3LjctMTExIDEwNi40IDAgMjMuMyA3LjkgNDUuNiAyMi45IDY0LjQgMi4xIDIuNiAyLjcgNi4xIDEuNyA5LjMtMSAzLjItMy42IDUuNy02LjggNi42LTY5LjIgMTkuMy0xMTcuNSA4MC44LTExNy41IDE0OS43IDAgNDEuNCAxNi45IDgwLjQgNDcuNiAxMDkuOSAzMC44IDI5LjYgNzEuNiA0NS45IDExNC44IDQ1LjloNTA2LjJjNDMuMyAwIDg0LTE2LjMgMTE0LjgtNDUuOSAzMC43LTI5LjUgNDcuNi02OC42IDQ3LjYtMTA5LjkgMC02OC45LTQ4LjMtMTMwLjQtMTE3LjUtMTQ5LjctMy4yLTAuOS01LjgtMy40LTYuOC02LjYtMS0zLjItMC40LTYuNyAxLjctOS4zIDE1LTE4LjggMjIuOS00MSAyMi45LTY0LjQgMC01OC43LTQ5LjgtMTA2LjQtMTExLTEwNi40aC0xM2MtNC4xIDAtNy44LTIuNS05LjMtNi4zLTEuNS0zLjgtMC41LTguMiAyLjQtMTEgOS44LTkuMiAxNy4xLTIwLjggMjEuMS0zMy40IDAuMy0wLjkgMC43LTEuOCAxLjItMi41IDguMy0xMi40IDEyLjYtMjYuNiAxMi42LTQxLjEgMC00Mi40LTM2LTc2LjgtODAuMi03Ni44SDUzMC44Yy0xLjUgMC0yMi45LTMtMjcuMS01LjQtMjIuMS0xMi40LTI1LTM5LTI1LTYzLjMgMC00LjUgMi0xNy44IDUuNS0zOS4yLTI4IDkuNC01NS43IDMxLjYtNzcuOCA2Mi42LTI0LjcgMzQuNy0zOS41IDc2LjYtMzkuNSAxMTIgMCAzMyAxMi4yIDc0LjYgMjUuNiA4Ny4yIDMgMi44IDQgNy4yIDIuNCAxMS0xLjUgMy44LTUuMiA2LjMtOS4zIDYuM2gtNzguMXoiDQogICAgICAgICAgZmlsbD0iIzIzMTgxNSIvPg0KICAgIDxwYXRoIGQ9Ik05MzcuOCA2NTQuNmMwLTc1LjMtNTIuOS0xMzkuMy0xMjQuOC0xNTkuMyAxNS43LTE5LjYgMjUuMS00NC4xIDI1LjEtNzAuNiAwLTY0LTU0LjUtMTE2LjQtMTIxLTExNi40aC0xM2MxMS0xMC4zIDE5LjItMjMuMiAyMy44LTM3LjcgOS0xMy41IDE0LjMtMjkuNSAxNC4zLTQ2LjYgMC0xNi43LTUuMS0zMi4zLTEzLjctNDUuNiAwIDAtMjYuMS0zNy40LTExNi00MS4yaC04MS44Yy0wLjggMC00LjQtMC41LTguNC0xLjItMjYgMzUuOC00Mi4zIDgwLTQyLjMgMTE5IDAgMzEuOSAxMS43IDc4LjQgMjguOCA5NC41aC03OC4xYy02Ni42IDAtMTIxIDUyLjQtMTIxIDExNi40IDAgMjYuNSA5LjQgNTEgMjUuMSA3MC42LTcxLjggMjAtMTI0LjggODQtMTI0LjggMTU5LjMgMCA0OS42IDIyLjkgOTQuMiA1OSAxMjQuN2g0OTYuM2M5NC45IDAgMTcyLjUtNzQuNiAxNzIuNS0xNjUuOXoiDQogICAgICAgICAgZmlsbD0iIzEyOTZkYiIvPg0KICAgIDxwYXRoIGQ9Ik03NjUuNCA4MzAuNUgyNTkuMmMtNDguNSAwLTk0LjItMTguMy0xMjguNy01MS41LTM0LjYtMzMuMy01My43LTc3LjUtNTMuNy0xMjQuNCAwLTM4LjggMTMtNzUuNyAzNy42LTEwNi42IDIwLjktMjYuMiA0OS4zLTQ2LjUgODEuMS01OC0xMi41LTE5LjctMTktNDItMTktNjUuMyAwLTY5LjcgNTguOC0xMjYuNCAxMzEtMTI2LjRoNTguN2MtNC45LTkuNC04LjYtMTkuOS0xMS4xLTI4LjUtNS4zLTE4LjUtOC40LTM4LjktOC40LTU1LjkgMC00MCAxNS44LTg1IDQzLjItMTIzLjYgMjkuMi00MSA2Ni40LTY3LjQgMTA0LjctNzQuMyAzLjItMC42IDYuNCAwLjQgOC43IDIuNyAyLjMgMi4yIDMuNCA1LjUgMi45IDguNi0wLjIgMS42LTAuOCA0LjgtMS41IDkuMy0xLjcgMTAuMy02LjIgMzcuNi02LjIgNDEuOSAwIDMxLjggNyA0MS4xIDE0LjEgNDUuNCAzLjYgMC45IDE1LjggMyAxOC40IDMuM2gxMjFjNTUuMyAwIDEwMC4yIDQzLjQgMTAwLjIgOTYuOCAwIDE4LTUuMyAzNS42LTE1LjIgNTEtMi44IDguMy02LjcgMTYuMi0xMS42IDIzLjUgNjguNCA0LjIgMTIyLjcgNTkuMiAxMjIuNyAxMjYuMiAwIDIzLjItNi41IDQ1LjUtMTkgNjUuMyAzMS44IDExLjYgNjAuMiAzMS44IDgxLjEgNTggMjQuNiAzMC45IDM3LjYgNjcuOCAzNy42IDEwNi42IDAgNDYuOS0xOS4xIDkxLTUzLjcgMTI0LjQtMzQuNiAzMy4yLTgwLjMgNTEuNS0xMjguNyA1MS41ek0zMDcuNSAzMTguM2MtNjEuMiAwLTExMSA0Ny43LTExMSAxMDYuNCAwIDIzLjMgNy45IDQ1LjYgMjIuOSA2NC40IDIuMSAyLjYgMi43IDYuMSAxLjcgOS4zLTEgMy4yLTMuNiA1LjctNi44IDYuNi02OS4yIDE5LjMtMTE3LjUgODAuOC0xMTcuNSAxNDkuNyAwIDQxLjQgMTYuOSA4MC40IDQ3LjYgMTA5LjkgMzAuOCAyOS42IDcxLjYgNDUuOSAxMTQuOCA0NS45aDUwNi4yYzQzLjMgMCA4NC0xNi4zIDExNC44LTQ1LjkgMzAuNy0yOS41IDQ3LjYtNjguNiA0Ny42LTEwOS45IDAtNjguOS00OC4zLTEzMC40LTExNy41LTE0OS43LTMuMi0wLjktNS44LTMuNC02LjgtNi42LTEtMy4yLTAuNC02LjcgMS43LTkuMyAxNS0xOC44IDIyLjktNDEgMjIuOS02NC40IDAtNTguNy00OS44LTEwNi40LTExMS0xMDYuNGgtMTNjLTQuMSAwLTcuOC0yLjUtOS4zLTYuMy0xLjUtMy44LTAuNS04LjIgMi40LTExIDkuOC05LjIgMTcuMS0yMC44IDIxLjEtMzMuNCAwLjMtMC45IDAuNy0xLjggMS4yLTIuNSA4LjMtMTIuNCAxMi42LTI2LjYgMTIuNi00MS4xIDAtNDIuNC0zNi03Ni44LTgwLjItNzYuOEg1MzAuOGMtMS41IDAtMjIuOS0zLTI3LjEtNS40LTIyLjEtMTIuNC0yNS0zOS0yNS02My4zIDAtNC41IDItMTcuOCA1LjUtMzkuMi0yOCA5LjQtNTUuNyAzMS42LTc3LjggNjIuNi0yNC43IDM0LjctMzkuNSA3Ni42LTM5LjUgMTEyIDAgMzMgMTIuMiA3NC42IDI1LjYgODcuMiAzIDIuOCA0IDcuMiAyLjQgMTEtMS41IDMuOC01LjIgNi4zLTkuMyA2LjNoLTc4LjF6Ig0KICAgICAgICAgIGZpbGw9IiMyMzE4MTUiLz4NCiAgICA8cGF0aCBkPSJNMzA2LjEgNTE5LjlhMjYuMiAyNi4yIDAgMSAwIDUyLjQgMCAyNi4yIDI2LjIgMCAxIDAtNTIuNCAwek02NjYgNTE5LjlhMjYuMiAyNi4yIDAgMSAwIDUyLjQgMCAyNi4yIDI2LjIgMCAxIDAtNTIuNCAweiINCiAgICAgICAgICBmaWxsPSIjMjMxODE1Ii8+DQogICAgPHBhdGggZD0iTTUxMi4zIDY0Mi40Yy00OC42IDAtOTQuMS01LjgtMTMzLjItMTUuOC0xNC4xLTMuNi0yNy41IDguNC0yNC40IDIyLjEgMTUuNSA3MC4yIDgwLjEgMTIyLjkgMTU3LjYgMTIyLjlzMTQyLjItNTIuNyAxNTcuNi0xMjIuOWMzLTEzLjgtMTAuMy0yNS44LTI0LjQtMjIuMS0zOS4yIDEwLTg0LjYgMTUuOC0xMzMuMiAxNS44eiINCiAgICAgICAgICBmaWxsPSIjRkZBNkQ3LyIvPg0KICAgIDxwYXRoIGQ9Ik01MTIuMyA3ODEuNmMtMzkuNCAwLTc3LjgtMTMuMi0xMDguMy0zNy4zLTMwLjEtMjMuOC01MS4xLTU3LTU5LjEtOTMuNS0yLjEtOS42IDAuOS0xOS41IDguMS0yNi41IDcuNi03LjMgMTguMy0xMC4xIDI4LjYtNy41IDM5LjUgMTAuMSA4NC43IDE1LjUgMTMwLjcgMTUuNSA0NiAwIDkxLjItNS40IDEzMC43LTE1LjUgMTAuMy0yLjYgMjEgMC4yIDI4LjYgNy41IDcuMiA3IDEwLjIgMTYuOSA4LjEgMjYuNS04IDM2LjUtMjkgNjkuNy01OS4xIDkzLjUtMzAuNSAyNC02OC45IDM3LjMtMTA4LjMgMzcuM3pNMzc0IDYzNS45Yy0yLjYgMC01LjEgMS03LjEgMi45LTEuMyAxLjMtMy4zIDMuOS0yLjUgNy44IDcuMSAzMiAyNS41IDYxLjIgNTIgODIuMSAyNi45IDIxLjMgNjEgMzMgOTUuOSAzM3M2OS0xMS43IDk1LjktMzNjMjYuNS0yMC45IDQ0LjktNTAuMSA1Mi04Mi4xIDAuOS0zLjktMS4yLTYuNS0yLjUtNy44LTIuNi0yLjUtNi4yLTMuNC05LjctMi41LTQxLjEgMTAuNi04OCAxNi4xLTEzNS43IDE2LjEtNDcuNyAwLTk0LjYtNS42LTEzNS43LTE2LjEtMC45LTAuMy0xLjgtMC40LTIuNi0wLjR6Ig0KICAgICAgICAgIGZpbGw9IiMyMzE4MTUiLz4NCiAgICA8cGF0aCBkPSJNNjE1LjkgNzM1LjJjLTI4LTIyLjctNjQuMi0zNi40LTEwMy43LTM2LjRzLTc1LjYgMTMuNy0xMDMuNyAzNi40YzI4IDIyLjcgNjQuMiAzNi40IDEwMy43IDM2LjRzNzUuNy0xMy43IDEwMy43LTM2LjR6Ig0KICAgICAgICAgIGZpbGw9IiNGRjY2QzEiLz4NCiAgICA8cGF0aCBkPSJNNTEyLjMgNzgxLjZjLTQwLjIgMC03OS4yLTEzLjctMTEwLTM4LjctMi4zLTEuOS0zLjctNC44LTMuNy03LjhzMS40LTUuOSAzLjctNy44YzMwLjctMjQuOSA2OS44LTM4LjcgMTEwLTM4LjdzNzkuMiAxMy43IDExMCAzOC43YzIuMyAxLjkgMy43IDQuOCAzLjcgNy44cy0xLjQgNS45LTMuNyA3LjhjLTMwLjggMjUtNjkuOSAzOC43LTExMCAzOC43eiBtLTg2LjktNDYuNGMyNS4zIDE3LjEgNTUuNyAyNi40IDg2LjkgMjYuNHM2MS41LTkuMyA4Ni45LTI2LjRjLTI1LjMtMTcuMS01NS43LTI2LjQtODYuOS0yNi40cy02MS42IDkuMi04Ni45IDI2LjR6Ig0KICAgICAgICAgIGZpbGw9IiMyMzE4MTUiLz4NCiAgICA8cGF0aCBkPSJNMjI0LjYgNjI3YTQ0LjIgMjcuNCAwIDEgMCA4OC40IDAgNDQuMiAyNy40IDAgMSAwLTg4LjQgMHpNNzA4LjYgNjI3YTQ0LjIgMjcuNCAwIDEgMCA4OC40IDAgNDQuMiAyNy40IDAgMSAwLTg4LjQgMHoiDQogICAgICAgICAgZmlsbD0iIzdBNDQyMCIvPg0KPC9zdmc+'
  }
];


export const usePoopStore = defineStore('poopStore', {
  state: () => ({
    poops: new Map<number, Poop>()
  }),
  getters: {
    getPoop(state) {
      return (id: number | undefined): Poop | undefined => {
        return id ? state.poops.get(id) : undefined;
      };
    }
  },
  actions: {
    async getPoopsAction() {
      // const {data} = await usePoopsApi()
      // this.poops = data
      tmp.forEach(poop => this.poops.set(poop.id, poop));
    }
  }
});
